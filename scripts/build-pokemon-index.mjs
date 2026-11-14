// Builds src/data/pokemon-index.json: every default Pokémon with id, name,
// types (in slot order) and generation. Uses 19 PokeAPI requests in total
// (the Pokémon list + one per type) instead of one request per Pokémon.
//
// Run: pnpm index:build   (re-run when a new generation is released)

import { writeFile, mkdir } from "node:fs/promises";

const API = "https://pokeapi.co/api/v2";
const MAX_ID = 1025;

// First national-dex id of each generation (Gen 1 starts at 1).
const GEN_STARTS = [1, 152, 252, 387, 494, 650, 722, 810, 906];

const TYPES = [
  "normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost",
  "steel", "fire", "water", "grass", "electric", "psychic", "ice", "dragon",
  "dark", "fairy",
];

async function get(path) {
  const res = await fetch(`${API}/${path}`);
  if (!res.ok) throw new Error(`${res.status} for ${path}`);
  return res.json();
}

const idFromUrl = (url) => Number(url.split("/").filter(Boolean).pop());
const genOf = (id) => GEN_STARTS.findLastIndex((start) => id >= start) + 1;

const [list, ...typeData] = await Promise.all([
  get(`pokemon?limit=${MAX_ID}`),
  ...TYPES.map((t) => get(`type/${t}`)),
]);

/** id -> [[slot, type], ...] */
const typesById = new Map();
for (const type of typeData) {
  for (const { pokemon, slot } of type.pokemon) {
    const id = idFromUrl(pokemon.url);
    if (id > MAX_ID) continue;
    if (!typesById.has(id)) typesById.set(id, []);
    typesById.get(id).push([slot, type.name]);
  }
}

const index = list.results
  .map((p) => {
    const id = idFromUrl(p.url);
    const types = (typesById.get(id) ?? [])
      .sort((a, b) => a[0] - b[0])
      .map(([, name]) => name);
    return { id, name: p.name, types, gen: genOf(id) };
  })
  .filter((p) => p.id <= MAX_ID)
  .sort((a, b) => a.id - b.id);

const missing = index.filter((p) => p.types.length === 0);
if (missing.length) {
  throw new Error(`No types for: ${missing.map((p) => p.name).join(", ")}`);
}

const out = new URL("../src/data/pokemon-index.json", import.meta.url);
await mkdir(new URL(".", out), { recursive: true });
// One entry per line: compact, but still diff-friendly.
await writeFile(
  out,
  "[\n" + index.map((p) => JSON.stringify(p)).join(",\n") + "\n]\n",
);
console.log(`Wrote ${index.length} Pokémon to ${out.pathname}`);
