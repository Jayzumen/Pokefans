import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export const MAX_TEAM_SIZE = 6;

/** What we store per team member. Artwork is derived from `id`. */
export interface TeamMember {
  id: number;
  name: string;
  types: string[];
  /** Base stat total. */
  bst: number;
}

export interface Team {
  uid: string;
  username: string;
  members: TeamMember[];
}

function toTeam(uid: string, data: Record<string, unknown>): Team {
  return {
    uid,
    username: String(data.username ?? ""),
    members: Array.isArray(data.members) ? (data.members as TeamMember[]) : [],
  };
}

export async function getTeam(uid: string): Promise<Team | null> {
  const snap = await getDoc(doc(db, "teams", uid));
  return snap.exists() ? toTeam(snap.id, snap.data()) : null;
}

export async function getTeamByUsername(username: string): Promise<Team | null> {
  const snap = await getDocs(
    query(
      collection(db, "teams"),
      where("usernameLower", "==", username.toLowerCase()),
      limit(1),
    ),
  );
  const d = snap.docs[0];
  return d ? toTeam(d.id, d.data()) : null;
}

export async function getAllTeams(): Promise<Team[]> {
  const snap = await getDocs(collection(db, "teams"));
  return snap.docs
    .map((d) => toTeam(d.id, d.data()))
    .filter((t) => t.members.length > 0);
}

export type ToggleResult = "added" | "removed" | "full";

/** Add or remove a Pokémon from the signed-in user's team, atomically. */
export async function toggleTeamMember(
  uid: string,
  username: string,
  member: TeamMember,
): Promise<ToggleResult> {
  const ref = doc(db, "teams", uid);
  return runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const members = snap.exists() ? toTeam(uid, snap.data()).members : [];
    const isMember = members.some((m) => m.id === member.id);

    if (!isMember && members.length >= MAX_TEAM_SIZE) return "full";

    const next = isMember
      ? members.filter((m) => m.id !== member.id)
      : [...members, member];

    tx.set(ref, {
      username,
      usernameLower: username.toLowerCase(),
      members: next,
      updatedAt: serverTimestamp(),
    });
    return isMember ? "removed" : "added";
  });
}
