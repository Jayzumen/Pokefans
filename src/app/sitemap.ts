import type { MetadataRoute } from "next";
import names from "@/data/names.json";
import { Generations } from "@/assets/constants";
import { pokemonIndex } from "@/lib/pokemon-index";
import { SITE_URL } from "@/lib/site";
import { TYPE_NAMES } from "@/lib/types";

/** Every public page, built from the static data (no API calls). */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${SITE_URL}${path}`;
  const pages = ["/", "/pokedex", "/types", "/moves", "/abilities", "/teams"];

  return [
    ...pages.map((p) => ({
      url: url(p),
      changeFrequency: "weekly" as const,
      priority: p === "/" ? 1 : 0.8,
    })),
    ...Generations.map((g) => ({ url: url(`/generations/${g.id}`), priority: 0.6 })),
    ...TYPE_NAMES.map((t) => ({ url: url(`/types/${t}`), priority: 0.6 })),
    ...pokemonIndex.map((p) => ({ url: url(`/pokemon/${p.name}`), priority: 0.7 })),
    ...names.moves.map((m) => ({ url: url(`/moves/${m}`), priority: 0.4 })),
    ...names.abilities.map((a) => ({ url: url(`/abilities/${a}`), priority: 0.4 })),
  ];
}
