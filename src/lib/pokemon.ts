/** Client- and server-safe Pokémon helpers. */

export function artworkUrl(id: number | string) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

/** Extract the numeric id from a PokeAPI resource URL (".../pokemon/25/"). */
export function idFromUrl(url: string) {
  return url.split("/").filter(Boolean).pop() ?? "";
}

export function formatDexNumber(id: number) {
  return `#${id.toString().padStart(3, "0")}`;
}
