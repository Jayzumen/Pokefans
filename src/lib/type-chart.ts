import chart from "@/data/type-chart.json";
import { TYPE_NAMES, type TypeName } from "./types";

const CHART = chart as Record<string, Record<string, number>>;

/** Damage multiplier of an `attacker` move against one defending type. */
export function multiplier(attacker: string, defender: string): number {
  return CHART[attacker]?.[defender] ?? 1;
}

/** Combined multiplier against a Pokémon with one or two types. */
export function multiplierVs(attacker: string, defenders: readonly string[]) {
  return defenders.reduce((m, d) => m * multiplier(attacker, d), 1);
}

/**
 * How every attacking type fares against a Pokémon with `types`,
 * grouped by multiplier (×4, ×2, ×½, ×¼, ×0). Neutral (×1) is omitted.
 */
export function defensiveProfile(types: readonly string[]) {
  const groups = new Map<number, TypeName[]>();
  for (const attacker of TYPE_NAMES) {
    const m = multiplierVs(attacker, types);
    if (m === 1) continue;
    groups.set(m, [...(groups.get(m) ?? []), attacker]);
  }
  return [4, 2, 0.5, 0.25, 0]
    .filter((m) => groups.has(m))
    .map((m) => ({ multiplier: m, types: groups.get(m)! }));
}

export function formatMultiplier(m: number) {
  if (m === 0.5) return "½";
  if (m === 0.25) return "¼";
  return String(m);
}
