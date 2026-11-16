/** Client- and server-safe Pokémon helpers. */

/** Highest national dex number we ship local artwork for. */
const LOCAL_ARTWORK_MAX_ID = 1025;

/** Original PNG artwork on GitHub (PokeAPI sprites repository). */
export function artworkSourceUrl(id: number | string) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

/**
 * Artwork URL for display. Default Pokémon use the pre-generated WebP in
 * public/artwork (static, CDN-cached, no image optimizer or quota needed).
 * Alternate forms (ids above 10000) fall back to the original PNG.
 */
export function artworkUrl(id: number | string) {
  const n = Number(id);
  return n >= 1 && n <= LOCAL_ARTWORK_MAX_ID
    ? `/artwork/${n}.webp`
    : artworkSourceUrl(id);
}

/** Extract the numeric id from a PokeAPI resource URL (".../pokemon/25/"). */
export function idFromUrl(url: string) {
  return url.split("/").filter(Boolean).pop() ?? "";
}

export function formatDexNumber(id: number) {
  return `#${id.toString().padStart(3, "0")}`;
}
