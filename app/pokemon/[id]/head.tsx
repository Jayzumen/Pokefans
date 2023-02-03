import { PokemonData } from "@/types/pokemonTypes";
import { getPokemonData } from "./page";

export default async function PokemonHead({
  params,
}: {
  params: { id: number };
}) {
  const pokemon: PokemonData = await getPokemonData(params.id);
  return (
    <>
      <title>{pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta
        name="description"
        content={`Page for Pokémon ${
          pokemon.name[0].toUpperCase() + pokemon.name.slice(1)
        }`}
      />
      <link rel="icon" type="image/svg+xml" href="/pokeball.svg" />
    </>
  );
}
