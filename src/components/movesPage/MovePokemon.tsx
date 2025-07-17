import { PokemonTypes } from "@/assets/constants";
import { MoveData } from "@/types/moveTypes";
import PokemonCard from "../PokemonCard";

function MovePokemon({ move }: { move: MoveData }) {
  return (
    <>
      <p className="py-4 text-2xl font-bold">
        Pokemon that can learn this move:
      </p>
      <div className="mx-auto grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        {move.pokemon.map((pokemon) => {
          const matchingTypes = pokemon.types.map((type) => {
            return PokemonTypes.filter(
              (pokemonType) => pokemonType.name === type.type.name,
            )[0];
          });
          return (
            <PokemonCard
              key={pokemon.name}
              pokemonData={pokemon}
              matchingTypes={matchingTypes}
            />
          );
        })}
      </div>
    </>
  );
}

export default MovePokemon;
