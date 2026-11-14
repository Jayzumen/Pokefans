import movesData from "@/data/moves.json";
import versionGroups from "@/data/version-groups.json";
import type { Move } from "@/types/pokemonTypes";

export type LearnMethod = "level-up" | "machine" | "egg" | "tutor" | "other";
export const METHODS: { id: LearnMethod; label: string }[] = [
  { id: "level-up", label: "Level-up" },
  { id: "machine", label: "TM / HM" },
  { id: "egg", label: "Egg" },
  { id: "tutor", label: "Tutor" },
  { id: "other", label: "Other" },
];

/** [type, category, power, accuracy, pp] */
export type MoveMeta = [string, string, number | null, number | null, number | null];

export interface GameInfo {
  name: string;
  gen: number;
  order: number;
  label: string;
  side: boolean;
}

/** One game's learnset: method -> [moveName, level][] (level only for level-up). */
export type GameLearnset = Partial<Record<LearnMethod, [string, number][]>>;

export interface LearnsetData {
  games: GameInfo[];
  learnsets: Record<string, GameLearnset>;
  meta: Record<string, MoveMeta>;
}

const GAMES = versionGroups as GameInfo[];
const META = movesData as unknown as Record<string, MoveMeta>;

function methodOf(name: string): LearnMethod {
  return name === "level-up" || name === "machine" || name === "egg" || name === "tutor"
    ? name
    : "other";
}

/**
 * Reduce PokeAPI's per-move version details to game -> method -> moves,
 * sorted for display, with details only for the moves this Pokémon uses.
 * Runs on the server so only this compact shape is sent to the browser.
 */
export function buildLearnsets(moves: Move[]): LearnsetData {
  const learnsets: Record<string, GameLearnset> = {};
  const used = new Set<string>();

  for (const m of moves) {
    for (const d of m.version_group_details) {
      const game = d.version_group.name;
      const method = methodOf(d.move_learn_method.name);
      const set = (learnsets[game] ??= {});
      const list = (set[method] ??= []);
      const level = method === "level-up" ? d.level_learned_at : 0;
      if (!list.some(([n, l]) => n === m.move.name && l === level)) {
        list.push([m.move.name, level]);
        used.add(m.move.name);
      }
    }
  }

  for (const set of Object.values(learnsets)) {
    for (const [method, list] of Object.entries(set)) {
      list.sort(
        method === "level-up"
          ? (a, b) => a[1] - b[1] || a[0].localeCompare(b[0])
          : (a, b) => a[0].localeCompare(b[0]),
      );
    }
  }

  const meta: Record<string, MoveMeta> = {};
  for (const name of used) {
    if (META[name]) meta[name] = META[name];
  }

  return {
    games: GAMES.filter((g) => learnsets[g.name]),
    learnsets,
    meta,
  };
}
