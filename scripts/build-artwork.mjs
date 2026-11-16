// Downloads the official artwork of every Pokémon in the static index and
// stores it as WebP in public/artwork/{id}.webp (about 19 KB each instead of
// about 125 KB PNG). The site serves these as plain static files, so it
// doesn't need an image optimizer (and its monthly quota) at all.
//
// Incremental: existing files are skipped. Use --force to redo all.
// Run: pnpm artwork:build   (after pnpm index:build adds new Pokémon)

import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import sharp from "sharp";

const SOURCE = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
const SIZE = 512; // source images are 475 px; never upscaled
const force = process.argv.includes("--force");

const outDir = new URL("../public/artwork/", import.meta.url);
await mkdir(outDir, { recursive: true });

const index = JSON.parse(
  await readFile(new URL("../src/data/pokemon-index.json", import.meta.url), "utf8"),
);

const exists = (url) =>
  stat(url).then(
    () => true,
    () => false,
  );

let done = 0;
let written = 0;
const failed = [];

async function convert(id) {
  const out = new URL(`${id}.webp`, outDir);
  if (!force && (await exists(out))) return;
  const res = await fetch(SOURCE(id));
  if (!res.ok) throw new Error(`${res.status} for #${id}`);
  const webp = await sharp(Buffer.from(await res.arrayBuffer()))
    .resize({ width: SIZE, height: SIZE, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80, alphaQuality: 90, effort: 6 })
    .toBuffer();
  await writeFile(out, webp);
  written++;
}

// Small worker pool: polite to GitHub, still quick.
const ids = index.map((p) => p.id);
let next = 0;
await Promise.all(
  Array.from({ length: 8 }, async () => {
    while (next < ids.length) {
      const id = ids[next++];
      try {
        await convert(id);
      } catch (e) {
        failed.push(`${id}: ${e.message}`);
      }
      if (++done % 100 === 0) console.log(`  ${done}/${ids.length}`);
    }
  }),
);

console.log(`Wrote ${written} artworks (${ids.length - written - failed.length} already present).`);
if (failed.length) {
  console.error(`Failed:\n${failed.join("\n")}`);
  process.exit(1);
}
