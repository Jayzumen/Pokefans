import { PokemonTypes } from "@/assets/constants";
import { MoveData } from "@/types/moveTypes";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function MovePokemon({ move }: { move: MoveData }) {
  return (
    <>
      <p className="py-4 text-2xl font-bold">
        Pokemon that can learn this move:
      </p>
      <div className="flex flex-wrap gap-8 p-4">
        {move.pokemon.map((pokemon) => {
          const matchingTypes = pokemon.types.map((type) => {
            return PokemonTypes.filter(
              (pokemonType) => pokemonType.name === type.type.name
            )[0];
          });
          return (
            <Link
              key={pokemon.name}
              style={{
                background: `linear-gradient(180deg, ${
                  matchingTypes[0].color
                } 0%, ${
                  matchingTypes[1] ? matchingTypes[1]?.color : "white"
                } 100%)`,
              }}
              href={`/pokemon/${pokemon.name}`}
              className="mx-auto flex min-w-[250px] flex-col items-center justify-center rounded-lg border border-black py-2 text-xl font-semibold shadow-md shadow-black transition "
            >
              <p className="mx-auto max-w-[200px] capitalize">{pokemon.name}</p>
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

export default MovePokemon;
