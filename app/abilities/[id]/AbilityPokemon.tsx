import { PokemonTypes } from "@/assets/constants";
import { AbilityData } from "@/types/abilityTypes";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function AbilityPokemon({ ability }: { ability: AbilityData }) {
  return (
    <>
      <p className="py-4 text-2xl font-bold">Pokemon with the ability:</p>
      <div className="flex flex-wrap gap-8 p-4 text-black">
        {ability.pokemonData.map((pokemon, index) => {
          const matchingTypes = pokemon.types.map((type) => {
            return PokemonTypes.filter(
              (pokemonType) => pokemonType.name === type.type.name
            )[0];
          });
          if (pokemon.sprites.other["official-artwork"].front_default)
            return (
              <Link
                key={index}
                href={`/pokemon/${pokemon.name}`}
                style={{
                  background: `linear-gradient(180deg, ${
                    matchingTypes[0].color
                  } 0%, ${
                    matchingTypes[1] ? matchingTypes[1]?.color : "white"
                  } 100%)`,
                }}
                className="mx-auto flex min-h-[300px] min-w-[250px] flex-col items-center justify-center rounded-lg border border-black py-2 text-xl font-semibold shadow-md shadow-black duration-300 hover:scale-105"
              >
                <p className="mx-auto max-w-[200px] capitalize">
                  {pokemon.name}
                </p>
                <Image
                  src={pokemon.sprites.other["official-artwork"].front_default}
                  alt={pokemon.name}
                  width={200}
                  height={200}
                />
              </Link>
            );
        })}
      </div>
    </>
  );
}

export default AbilityPokemon;
