import { PokemonTypes } from "@/assets/constants";
import { PokemonData } from "@/types/pokemonTypes";
import PokemonCard from "../PokemonCard";

export default function DefaultPokemon({
  pokemon,
}: {
  pokemon: PokemonData[];
}) {
  return (
    <div className="mx-auto my-4 grid max-w-[1200px] grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
      {pokemon.map((pokemon) => {
        const matchingTypes = pokemon.types.map((type) => {
          return PokemonTypes.filter(
            (pokemonType) => pokemonType.name === type.type.name,
          )[0];
        });
        return (
          <PokemonCard
            key={pokemon.id}
            pokemonData={pokemon}
            matchingTypes={matchingTypes}
          />
        );
      })}
    </div>
  );
}
