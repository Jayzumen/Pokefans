import { beforeEach, describe, expect, it, vi } from "vitest";

const fs = vi.hoisted(() => ({
  txGet: vi.fn(),
  txSet: vi.fn(),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  where: vi.fn((...args: unknown[]) => ({ where: args })),
}));

vi.mock("./firebase", () => ({ db: {} }));
vi.mock("firebase/firestore", () => ({
  doc: (_db: unknown, ...path: string[]) => ({ path: path.join("/") }),
  collection: (_db: unknown, ...path: string[]) => ({ path: path.join("/") }),
  query: (...parts: unknown[]) => ({ parts }),
  where: fs.where,
  limit: (n: number) => ({ limit: n }),
  getDoc: fs.getDoc,
  getDocs: fs.getDocs,
  serverTimestamp: () => "SERVER_TIME",
  runTransaction: async (_db: unknown, fn: (tx: unknown) => unknown) =>
    fn({ get: fs.txGet, set: fs.txSet }),
}));

import { getAllTeams, getTeamByUsername, MAX_TEAM_SIZE, toggleTeamMember, type TeamMember } from "./teams";

const mon = (id: number): TeamMember => ({ id, name: `mon-${id}`, types: ["normal"], bst: 300 });
const snap = (data?: Record<string, unknown>) => ({ exists: () => !!data, data: () => data });

beforeEach(() => Object.values(fs).forEach((m) => m.mockClear()));

describe("toggleTeamMember", () => {
  it("adds a Pokémon to an empty team", async () => {
    fs.txGet.mockResolvedValue(snap());
    await expect(toggleTeamMember("u1", "Ash", mon(25))).resolves.toBe("added");
    expect(fs.txSet).toHaveBeenCalledWith(
      { path: "teams/u1" },
      { username: "Ash", usernameLower: "ash", members: [mon(25)], updatedAt: "SERVER_TIME" },
    );
  });

  it("removes a Pokémon that is already in the team", async () => {
    fs.txGet.mockResolvedValue(snap({ username: "Ash", members: [mon(1), mon(25)] }));
    await expect(toggleTeamMember("u1", "Ash", mon(25))).resolves.toBe("removed");
    expect(fs.txSet.mock.calls[0][1].members).toEqual([mon(1)]);
  });

  it(`refuses a 7th member without writing (max ${MAX_TEAM_SIZE})`, async () => {
    const full = [1, 2, 3, 4, 5, 6].map(mon);
    fs.txGet.mockResolvedValue(snap({ username: "Ash", members: full }));
    await expect(toggleTeamMember("u1", "Ash", mon(7))).resolves.toBe("full");
    expect(fs.txSet).not.toHaveBeenCalled();
  });

  it("still allows removing from a full team", async () => {
    const full = [1, 2, 3, 4, 5, 6].map(mon);
    fs.txGet.mockResolvedValue(snap({ username: "Ash", members: full }));
    await expect(toggleTeamMember("u1", "Ash", mon(6))).resolves.toBe("removed");
  });
});

describe("team queries", () => {
  it("looks teams up by lowercase username", async () => {
    fs.getDocs.mockResolvedValue({
      docs: [{ id: "u1", data: () => ({ username: "Ash", members: [mon(25)] }) }],
    });
    await expect(getTeamByUsername("ASH")).resolves.toEqual({
      uid: "u1",
      username: "Ash",
      members: [mon(25)],
    });
    expect(fs.where).toHaveBeenCalledWith("usernameLower", "==", "ash");
  });

  it("returns null for unknown users and hides empty teams from the list", async () => {
    fs.getDocs.mockResolvedValueOnce({ docs: [] });
    await expect(getTeamByUsername("nobody")).resolves.toBeNull();

    fs.getDocs.mockResolvedValueOnce({
      docs: [
        { id: "a", data: () => ({ username: "A", members: [mon(1)] }) },
        { id: "b", data: () => ({ username: "B", members: [] }) },
        { id: "c", data: () => ({ username: "C" }) }, // malformed
      ],
    });
    const teams = await getAllTeams();
    expect(teams.map((t) => t.username)).toEqual(["A"]);
  });
});
