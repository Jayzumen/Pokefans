import { cache } from "react";
import { pokeapi } from "@/lib/pokeapi";
import type { EvolutionChain, PokemonData, Species } from "@/types/pokemonTypes";

/**
 * Everything the detail page needs, fetched once per request even though
 * several streamed sections ask for it (React `cache`).
 */
export const getPokemonDetail = cache(async (slug: string) => {
  const pokemon = await pokeapi<PokemonData>(`pokemon/${slug}`);
  const species = await pokeapi<Species>(pokemon.species.url);
  const chain = species.evolution_chain?.url
    ? await pokeapi<EvolutionChain>(species.evolution_chain.url)
    : undefined;
  return { pokemon, species, chain };
});

export type PokemonDetail = Awaited<ReturnType<typeof getPokemonDetail>>;
