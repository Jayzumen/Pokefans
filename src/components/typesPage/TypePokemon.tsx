import { PokemonTypes } from "@/assets/constants";
import { TypeData } from "@/types/typeTypes";
import React from "react";
import PokemonCard from "../PokemonCard";

function TypePokemon({ typeData }: { typeData: TypeData }) {
  return (
    <div className="my-4">
      <h2 className="my-2 text-2xl font-bold">Pokemon with this Type:</h2>
      <div className="mx-auto grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        {typeData.pokemonData.map((pokemon) => {
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
    </div>
  );
}

export default TypePokemon;
