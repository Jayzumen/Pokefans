import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { app, db } from "./firebase";
import type { TeamMember } from "./teams";
import { MIN_PASSWORD_LENGTH, USERNAME_PATTERN } from "./validation";

export const auth = getAuth(app);

export { USERNAME_PATTERN, MIN_PASSWORD_LENGTH };

export interface Profile {
  username: string;
}

/** A user-facing error with a message that is safe to show in the UI. */
export class AuthError extends Error {}

export function friendlyAuthError(error: unknown): string {
  if (error instanceof AuthError) return error.message;
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
      case "auth/invalid-email":
        return "Email or password is incorrect.";
      case "auth/email-already-in-use":
        return "An account with this email already exists. Try signing in.";
      case "auth/weak-password":
      case "auth/password-does-not-meet-requirements":
        return `Please choose a stronger password (at least ${MIN_PASSWORD_LENGTH} characters).`;
      case "auth/too-many-requests":
        return "Too many attempts. Please wait a moment and try again.";
      case "auth/network-request-failed":
        return "Network error. Check your connection and try again.";
    }
  }
  return "Something went wrong. Please try again.";
}

export async function getProfile(uid: string): Promise<Profile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as Profile) : null;
}

/**
 * Atomically reserve `usernames/{lowercase}` and create `users/{uid}`.
 * Fails if the name is taken or the user already has a profile.
 */
export async function claimUsername(uid: string, username: string) {
  if (!USERNAME_PATTERN.test(username)) {
    throw new AuthError(
      "Usernames must be 3–20 characters: letters, numbers or underscores.",
    );
  }
  const nameRef = doc(db, "usernames", username.toLowerCase());
  const userRef = doc(db, "users", uid);

  await runTransaction(db, async (tx) => {
    const [nameSnap, userSnap] = await Promise.all([
      tx.get(nameRef),
      tx.get(userRef),
    ]);
    if (nameSnap.exists()) {
      throw new AuthError("This username is already taken.");
    }
    if (userSnap.exists()) {
      throw new AuthError("This account already has a username.");
    }
    tx.set(nameRef, { uid });
    tx.set(userRef, { username, createdAt: serverTimestamp() });
  });
}

export async function signUpUser(
  username: string,
  email: string,
  password: string,
): Promise<Profile> {
  if (!USERNAME_PATTERN.test(username)) {
    throw new AuthError(
      "Usernames must be 3–20 characters: letters, numbers or underscores.",
    );
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new AuthError(
      `Passwords need at least ${MIN_PASSWORD_LENGTH} characters.`,
    );
  }
  // Cheap pre-check so we don't create an auth account for a taken name.
  const taken = await getDoc(doc(db, "usernames", username.toLowerCase()));
  if (taken.exists()) throw new AuthError("This username is already taken.");

  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  try {
    await claimUsername(user.uid, username);
  } catch (error) {
    // Roll back the auth account so the email can be used again.
    await user.delete().catch(() => {});
    throw error;
  }
  return { username };
}

/** Signs in and returns the profile (migrating a legacy account if needed). */
export async function signInUser(
  email: string,
  password: string,
): Promise<Profile | null> {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return (await getProfile(user.uid)) ?? (await migrateLegacyAccount(user.uid));
}

export async function signOutUser() {
  await signOut(auth);
}

export async function requestPasswordReset(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch {
    // Deliberately silent: don't reveal whether an account exists.
  }
}

/**
 * One-time migration from the old data model
 * (`Users/{uid}` + `Teams/{username}/pokemonTeam/*`) to the new one
 * (`users/{uid}`, `usernames/{name}`, `teams/{uid}`).
 * Returns null if there is nothing to migrate or the old username can't be
 * claimed; the UI then asks the user to pick a username.
 */
export async function migrateLegacyAccount(
  uid: string,
): Promise<Profile | null> {
  try {
    const legacy = await getDoc(doc(db, "Users", uid));
    const username = legacy.exists()
      ? (legacy.data().username as string | undefined)
      : undefined;
    if (!username || !USERNAME_PATTERN.test(username)) return null;

    await claimUsername(uid, username);

    const oldTeam = await getDocs(
      collection(db, "Teams", username, "pokemonTeam"),
    );
    const members: TeamMember[] = oldTeam.docs
      .map((d) => d.data())
      .slice(0, 6)
      .map((m) => ({
        id: Number(m.id),
        name: String(m.name),
        types: Array.isArray(m.types)
          ? m.types.map((t: { type: { name: string } }) => t.type.name)
          : [],
        bst: Array.isArray(m.stats)
          ? m.stats.reduce(
              (sum: number, s: { base_stat: number }) => sum + s.base_stat,
              0,
            )
          : 0,
      }));
    if (members.length > 0) {
      await setDoc(doc(db, "teams", uid), {
        username,
        usernameLower: username.toLowerCase(),
        members,
        updatedAt: serverTimestamp(),
      });
    }
    return { username };
  } catch {
    // A concurrent call (e.g. the auth listener) may have migrated already.
    return getProfile(uid).catch(() => null);
  }
}
