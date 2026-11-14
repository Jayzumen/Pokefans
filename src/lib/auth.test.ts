import { beforeEach, describe, expect, it, vi } from "vitest";

// --- Firebase mocks -------------------------------------------------------
const fb = vi.hoisted(() => ({
  createUser: vi.fn(),
  signIn: vi.fn(),
  resetEmail: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  setDoc: vi.fn(),
  txGet: vi.fn(),
  txSet: vi.fn(),
}));

vi.mock("./firebase", () => ({ app: {}, db: {} }));
vi.mock("firebase/app", () => {
  class FirebaseError extends Error {
    constructor(public code: string, message?: string) {
      super(message ?? code);
    }
  }
  return { FirebaseError };
});
vi.mock("firebase/auth", () => ({
  getAuth: () => ({ currentUser: null }),
  createUserWithEmailAndPassword: fb.createUser,
  signInWithEmailAndPassword: fb.signIn,
  sendPasswordResetEmail: fb.resetEmail,
  signOut: vi.fn(),
}));
vi.mock("firebase/firestore", () => ({
  doc: (_db: unknown, ...path: string[]) => ({ path: path.join("/") }),
  collection: (_db: unknown, ...path: string[]) => ({ path: path.join("/") }),
  getDoc: fb.getDoc,
  getDocs: fb.getDocs,
  setDoc: fb.setDoc,
  serverTimestamp: () => "SERVER_TIME",
  runTransaction: async (_db: unknown, fn: (tx: unknown) => unknown) =>
    fn({ get: fb.txGet, set: fb.txSet }),
}));

import { FirebaseError } from "firebase/app";
import {
  AuthError,
  claimUsername,
  friendlyAuthError,
  migrateLegacyAccount,
  requestPasswordReset,
  signInUser,
  signUpUser,
} from "./auth";

const snap = (data?: Record<string, unknown>) => ({
  exists: () => !!data,
  data: () => data,
});

beforeEach(() => {
  Object.values(fb).forEach((m) => m.mockReset());
  fb.txGet.mockResolvedValue(snap());
  fb.getDoc.mockResolvedValue(snap());
});

describe("friendlyAuthError", () => {
  it("never reveals whether an email exists", () => {
    for (const code of ["auth/invalid-credential", "auth/wrong-password", "auth/user-not-found"]) {
      expect(friendlyAuthError(new FirebaseError(code, code))).toBe("Email or password is incorrect.");
    }
  });

  it("maps other known codes and hides unknown errors", () => {
    expect(friendlyAuthError(new FirebaseError("auth/too-many-requests", "auth/too-many-requests"))).toMatch(/Too many/);
    expect(friendlyAuthError(new AuthError("Custom"))).toBe("Custom");
    expect(friendlyAuthError(new Error("stack trace with secrets"))).toBe(
      "Something went wrong. Please try again.",
    );
  });
});

describe("claimUsername", () => {
  it("reserves the lowercase name and creates the profile in one transaction", async () => {
    await claimUsername("uid1", "Ash_K");
    expect(fb.txSet).toHaveBeenCalledWith({ path: "usernames/ash_k" }, { uid: "uid1" });
    expect(fb.txSet).toHaveBeenCalledWith(
      { path: "users/uid1" },
      { username: "Ash_K", createdAt: "SERVER_TIME" },
    );
  });

  it("refuses taken names and second usernames", async () => {
    fb.txGet.mockResolvedValueOnce(snap({ uid: "other" })).mockResolvedValueOnce(snap());
    await expect(claimUsername("uid1", "ash")).rejects.toThrow(/already taken/);

    fb.txGet.mockResolvedValueOnce(snap()).mockResolvedValueOnce(snap({ username: "x" }));
    await expect(claimUsername("uid1", "ash")).rejects.toThrow(/already has a username/);
    expect(fb.txSet).not.toHaveBeenCalled();
  });

  it("validates the name before touching the database", async () => {
    await expect(claimUsername("uid1", "a b")).rejects.toBeInstanceOf(AuthError);
    expect(fb.txGet).not.toHaveBeenCalled();
  });
});

describe("signUpUser", () => {
  it("rejects bad input without creating an account", async () => {
    await expect(signUpUser("x", "a@b.c", "longenough")).rejects.toThrow(/3–20/);
    await expect(signUpUser("ash", "a@b.c", "short")).rejects.toThrow(/8 characters/);
    expect(fb.createUser).not.toHaveBeenCalled();
  });

  it("stops early when the username is taken", async () => {
    fb.getDoc.mockResolvedValueOnce(snap({ uid: "someone" }));
    await expect(signUpUser("ash", "a@b.c", "longenough")).rejects.toThrow(/taken/);
    expect(fb.createUser).not.toHaveBeenCalled();
  });

  it("deletes the new auth account if claiming the name fails", async () => {
    const del = vi.fn().mockResolvedValue(undefined);
    fb.createUser.mockResolvedValue({ user: { uid: "u1", delete: del } });
    fb.txGet.mockResolvedValueOnce(snap({ uid: "race-winner" })); // lost a race
    await expect(signUpUser("ash", "a@b.c", "longenough")).rejects.toThrow(/taken/);
    expect(del).toHaveBeenCalled();
  });

  it("returns the profile on success", async () => {
    fb.createUser.mockResolvedValue({ user: { uid: "u1", delete: vi.fn() } });
    await expect(signUpUser("Ash", "a@b.c", "longenough")).resolves.toEqual({ username: "Ash" });
  });
});

describe("signInUser", () => {
  it("returns the stored profile", async () => {
    fb.signIn.mockResolvedValue({ user: { uid: "u1" } });
    fb.getDoc.mockResolvedValueOnce(snap({ username: "Ash" }));
    await expect(signInUser("a@b.c", "pw")).resolves.toEqual({ username: "Ash" });
  });

  it("propagates sign-in failures instead of reporting success", async () => {
    fb.signIn.mockRejectedValue(new FirebaseError("auth/invalid-credential", "auth/invalid-credential"));
    await expect(signInUser("a@b.c", "wrong")).rejects.toBeInstanceOf(FirebaseError);
  });
});

describe("migrateLegacyAccount", () => {
  it("claims the old username and copies the old team", async () => {
    fb.getDoc.mockResolvedValueOnce(snap({ username: "Ash" })); // Users/{uid}
    fb.getDocs.mockResolvedValueOnce({
      docs: [
        {
          data: () => ({
            id: 6,
            name: "charizard",
            types: [{ type: { name: "fire" } }, { type: { name: "flying" } }],
            stats: [{ base_stat: 78 }, { base_stat: 84 }],
          }),
        },
      ],
    });
    await expect(migrateLegacyAccount("u1")).resolves.toEqual({ username: "Ash" });
    expect(fb.setDoc).toHaveBeenCalledWith(
      { path: "teams/u1" },
      expect.objectContaining({
        username: "Ash",
        usernameLower: "ash",
        members: [{ id: 6, name: "charizard", types: ["fire", "flying"], bst: 162 }],
      }),
    );
  });

  it("does nothing for accounts without a valid legacy username", async () => {
    fb.getDoc.mockResolvedValueOnce(snap({ username: "has spaces" }));
    await expect(migrateLegacyAccount("u1")).resolves.toBeNull();
    expect(fb.txSet).not.toHaveBeenCalled();
  });
});

describe("requestPasswordReset", () => {
  it("swallows errors so it can't be used to probe for accounts", async () => {
    fb.resetEmail.mockRejectedValue(new FirebaseError("auth/user-not-found", "auth/user-not-found"));
    await expect(requestPasswordReset("nobody@example.com")).resolves.toBeUndefined();
  });
});
