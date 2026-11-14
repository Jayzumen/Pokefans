import type { CSSProperties } from "react";

export const TYPE_NAMES = [
  "normal", "fire", "water", "grass", "electric", "ice", "fighting", "poison",
  "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark",
  "steel", "fairy",
] as const;

export type TypeName = (typeof TYPE_NAMES)[number];

export function isTypeName(value: string): value is TypeName {
  return (TYPE_NAMES as readonly string[]).includes(value);
}

/** CSS variables (--t, --t2) that drive .type-surface / .type-soft / .type-ink. */
export function typeVars(types: readonly string[]): CSSProperties {
  const [first = "normal", second = first] = types;
  return {
    "--t": `var(--type-${first})`,
    "--t2": `var(--type-${second})`,
  } as CSSProperties;
}

export const REGIONS: Record<number, string> = {
  1: "Kanto",
  2: "Johto",
  3: "Hoenn",
  4: "Sinnoh",
  5: "Unova",
  6: "Kalos",
  7: "Alola",
  8: "Galar",
  9: "Paldea",
};

export const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];

/** "special-attack" -> "Special Attack" */
export function titleCase(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** PokeAPI flavor text contains form feeds and hard line breaks. */
export function cleanText(text: string | undefined) {
  return text?.replace(/[\f\n\r­]+/g, " ").replace(/\s+/g, " ").trim();
}
