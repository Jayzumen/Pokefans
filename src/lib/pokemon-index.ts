import rawIndex from "@/data/pokemon-index.json";
import { idFromUrl } from "./pokemon";

/** One default Pokémon from the static, build-time index. */
export interface IndexPokemon {
  id: number;
  name: string;
  /** Type names in slot order, e.g. ["grass", "poison"]. */
  types: string[];
  gen: number;
}

/** All default Pokémon (national dex 1–1025), sorted by id. */
export const pokemonIndex: readonly IndexPokemon[] = rawIndex;

const byId = new Map(pokemonIndex.map((p) => [p.id, p]));
const byName = new Map(pokemonIndex.map((p) => [p.name, p]));

export function getPokemonById(id: number) {
  return byId.get(id);
}

/** Look up by slug ("charizard") or dex number ("6"). */
export function findPokemon(slug: string) {
  return byName.get(slug) ?? (/^\d+$/.test(slug) ? byId.get(Number(slug)) : undefined);
}

/** Shared view-transition name for a Pokémon's artwork (card ↔ detail). */
export const artworkTransitionName = (id: number) => `pokemon-art-${id}`;

export function getPokemonByGen(gen: number) {
  return pokemonIndex.filter((p) => p.gen === gen);
}

/**
 * Resolve PokeAPI resource refs ({ url }) to index entries.
 * Alternate forms (ids above 1025) aren't in the index and are skipped.
 */
export function resolveRefs(refs: readonly { url: string }[]) {
  const seen = new Set<number>();
  const out: IndexPokemon[] = [];
  for (const ref of refs) {
    const p = byId.get(Number(idFromUrl(ref.url)));
    if (p && !seen.has(p.id)) {
      seen.add(p.id);
      out.push(p);
    }
  }
  return out.sort((a, b) => a.id - b.id);
}

/** Small deterministic PRNG so a given seed always yields the same picks. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** `count` Pokémon that stay the same for a whole (UTC) day. */
export function pokemonOfTheDay(count: number, date = new Date()) {
  const day = Math.floor(date.getTime() / 86_400_000);
  const rand = mulberry32(day);
  const picks = new Set<IndexPokemon>();
  while (picks.size < count) {
    picks.add(pokemonIndex[Math.floor(rand() * pokemonIndex.length)]);
  }
  return [...picks];
}
