// Builds the static data the site ships with:
//   src/data/pokemon-index.json   every default Pokémon: id, name, types, gen
//   src/data/type-chart.json      attack multipliers between the 18 types
//   src/data/names.json           all move and ability names (for search)
//   src/data/version-groups.json  every game: generation, release order, label
//   src/data/moves.json           type/category/power/accuracy/PP per move
//
// About 1,000 PokeAPI requests in total (one per move for moves.json), so
// it runs at build-maintenance time, never per page view.
//
// Run: pnpm index:build   (re-run when a new game or generation is released)

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

const [list, moves, abilities, ...typeData] = await Promise.all([
  get(`pokemon?limit=${MAX_ID}`),
  get("move?limit=2000"),
  get("ability?limit=1000"),
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

// chart[attacker][defender] = multiplier, only for non-neutral matchups.
const chart = {};
for (const type of typeData) {
  const rel = type.damage_relations;
  const row = {};
  for (const t of rel.double_damage_to) row[t.name] = 2;
  for (const t of rel.half_damage_to) row[t.name] = 0.5;
  for (const t of rel.no_damage_to) row[t.name] = 0;
  chart[type.name] = row;
}
await writeFile(
  new URL("../src/data/type-chart.json", import.meta.url),
  JSON.stringify(chart, null, 2) + "\n",
);

// Main-series names only (ids above 10000 are shadow/special variants).
const mainSeries = (r) =>
  r.results
    .filter((x) => idFromUrl(x.url) < 10000)
    .map((x) => x.name)
    .sort();
await writeFile(
  new URL("../src/data/names.json", import.meta.url),
  JSON.stringify({ moves: mainSeries(moves), abilities: mainSeries(abilities) }) +
    "\n",
);

// One entry per line: compact, but still diff-friendly.
await writeFile(
  out,
  "[\n" + index.map((p) => JSON.stringify(p)).join(",\n") + "\n]\n",
);
console.log(`Wrote ${index.length} Pokémon to ${out.pathname}`);

/* ---------------------------------------------------------------- */
/*  Games (version groups) and move details                          */
/* ---------------------------------------------------------------- */

/** Run `fn` over `items` with at most `limit` requests in flight. */
async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: limit }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i]);
      }
    }),
  );
  return out;
}

const title = (slug) =>
  slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

// Japan-only and spin-off releases: listed after the main games.
const SIDE_GAMES = new Set(["red-green-japan", "blue-japan", "colosseum", "xd", "champions"]);

// Official spellings where the slug can't be title-cased mechanically.
const LABELS = {
  "red-green-japan": "Red / Green (Japan)",
  "blue-japan": "Blue (Japan)",
  xd: "XD: Gale of Darkness",
  "firered-leafgreen": "FireRed / LeafGreen",
  "heartgold-soulsilver": "HeartGold / SoulSilver",
  "lets-go-pikachu-lets-go-eevee": "Let’s Go, Pikachu! / Eevee!",
  "the-isle-of-armor": "The Isle of Armor (DLC)",
  "the-crown-tundra": "The Crown Tundra (DLC)",
  "legends-arceus": "Legends: Arceus",
  "the-teal-mask": "The Teal Mask (DLC)",
  "the-indigo-disk": "The Indigo Disk (DLC)",
  "legends-za": "Legends: Z-A",
  "mega-dimension": "Mega Dimension (DLC)",
  champions: "Pokémon Champions",
};

const groupList = await get("version-group?limit=100");
const groups = await mapLimit(groupList.results, 8, (g) => get(`version-group/${g.name}`));
const versionGroups = groups
  .map((g) => {
    const label =
      LABELS[g.name] ?? g.versions.map((v) => title(v.name)).join(" / ");
    return {
      name: g.name,
      gen: idFromUrl(g.generation.url),
      order: g.order,
      label,
      side: SIDE_GAMES.has(g.name),
    };
  })
  .sort((a, b) => a.order - b.order);
await writeFile(
  new URL("../src/data/version-groups.json", import.meta.url),
  "[\n" + versionGroups.map((g) => JSON.stringify(g)).join(",\n") + "\n]\n",
);
console.log(`Wrote ${versionGroups.length} games`);

// Compact tuple per move: [type, category, power, accuracy, pp]
const moveRefs = moves.results.filter((m) => idFromUrl(m.url) < 10000);
let done = 0;
const moveDetails = await mapLimit(moveRefs, 16, async (m) => {
  const d = await get(`move/${m.name}`);
  if (++done % 100 === 0) console.log(`  moves ${done}/${moveRefs.length}`);
  return [m.name, [d.type.name, d.damage_class?.name ?? "status", d.power, d.accuracy, d.pp]];
});
await writeFile(
  new URL("../src/data/moves.json", import.meta.url),
  "{\n" +
    moveDetails
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, t]) => `${JSON.stringify(name)}:${JSON.stringify(t)}`)
      .join(",\n") +
    "\n}\n",
);
console.log(`Wrote ${moveDetails.length} moves`);
