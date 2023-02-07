import { PokemonTypes } from "@/assets/constants";
import { TypeData } from "@/types/typeTypes";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function TypePokemon({ typeData }: { typeData: TypeData }) {
  return (
    <div className="my-4">
      <h2 className="my-2 text-2xl font-bold">Pokemon with this Type:</h2>
      <div className="flex flex-wrap justify-center gap-4 px-2">
        {typeData.pokemonData.map((pokemon, index) => {
          const matchingTypes = pokemon.types.map((type) => {
            return PokemonTypes.filter(
              (pokemonType) => pokemonType.name === type.type.name
            )[0];
          });
          if (pokemon.sprites.other["official-artwork"].front_default)
            return (
              <Link
                key={index}
                style={{
                  background: `linear-gradient(180deg, ${
                    matchingTypes[0].color
                  } 0%, ${
                    matchingTypes[1] ? matchingTypes[1]?.color : "white"
                  } 100%)`,
                }}
                className="flex min-h-[250px] flex-col items-center rounded-lg border border-black p-2 capitalize shadow-md shadow-black duration-300 hover:scale-105"
                href={`/pokemon/${pokemon.name}`}
              >
                <p className="mx-auto min-h-[70px] max-w-[170px] text-xl font-semibold">
                  {pokemon.name}
                </p>
                <Image
                  loading="lazy"
                  src={pokemon.sprites.other["official-artwork"].front_default}
                  width={200}
                  height={200}
                  alt={pokemon.name}
                />
              </Link>
            );
        })}
      </div>
    </div>
  );
}

export default TypePokemon;
