import { cleanText } from "./types";

interface LocalizedEntry {
  language: { name: string };
}

/** English entry from a PokeAPI list of localized entries. */
export function english<T extends LocalizedEntry>(entries: readonly T[] | undefined) {
  return entries?.find((e) => e.language.name === "en");
}

/**
 * Best English description for a move or ability: the short effect, then
 * the long effect, then the latest flavor text.
 */
export function describe(data: {
  effect_entries?: { short_effect?: string; effect: string; language: { name: string } }[];
  flavor_text_entries?: { flavor_text: string; language: { name: string } }[];
  effect_chance?: number | null;
}) {
  const effect = english(data.effect_entries);
  const flavor = [...(data.flavor_text_entries ?? [])]
    .reverse()
    .find((e) => e.language.name === "en");
  const text =
    effect?.short_effect ?? effect?.effect ?? flavor?.flavor_text ?? "";
  return (
    cleanText(text.replace(/\$effect_chance/g, String(data.effect_chance ?? ""))) ||
    "No description yet."
  );
}
