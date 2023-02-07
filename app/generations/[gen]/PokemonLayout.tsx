import { GenPokemonData } from "@/types/generationTypes";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PokemonTypes } from "@/assets/constants";

function PokemonLayout({ data }: { data: GenPokemonData[] }) {
  return (
    <main className="px-4">
      <div className="flex flex-wrap gap-8 text-black">
        {data
          .sort((a, b) => (a.id > b.id ? 1 : -1))
          .map((pokemon, index) => {
            const matchingTypes = pokemon.types.map((type) => {
              return PokemonTypes.filter(
                (pokemonType) => pokemonType.name === type.type.name
              )[0];
            });
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
                className="mx-auto flex min-w-[250px] flex-col items-center justify-center rounded-lg py-2 text-xl font-semibold transition"
              >
                <p>
                  #
                  {pokemon.id < 10
                    ? `00${pokemon.id}`
                    : pokemon.id < 100
                    ? `0${pokemon.id}`
                    : pokemon.id}
                </p>

                <p className="text-xl font-semibold capitalize">
                  {pokemon.name}
                </p>
                <Image
                  loading="lazy"
                  src={pokemon.sprites.other["official-artwork"].front_default}
                  alt={pokemon.name}
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </Link>
            );
          })}
      </div>
    </main>
  );
}

export default PokemonLayout;
