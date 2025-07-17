import { PokemonTypes } from "@/assets/constants";
import { AbilityData } from "@/types/abilityTypes";
import PokemonCard from "../PokemonCard";

function AbilityPokemon({ ability }: { ability: AbilityData }) {
  return (
    <>
      <p className="py-4 text-2xl font-bold">Pokemon with the ability:</p>
      <div className="flex flex-wrap gap-8 p-4 text-black">
        {ability.pokemonData.map((pokemon) => {
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

export default AbilityPokemon;
