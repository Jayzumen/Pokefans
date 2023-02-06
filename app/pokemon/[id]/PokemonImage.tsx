import { PokemonTypes } from "@/assets/constants";
import { PokemonData } from "@/types/pokemonTypes";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function PokemonImage({ pokemon }: { pokemon: PokemonData }) {
  const englishGenus = pokemon.speciesData.genera.find(
    (genus: any) => genus.language.name === "en"
  );

  return (
    <>
      <div className="mx-auto mt-4 flex flex-col md:w-[80%] lg:flex-row lg:justify-between">
        <div className="flex flex-col">
          <p className="text-2xl font-semibold">
            #
            {pokemon.id < 10
              ? `00${pokemon.id}`
              : pokemon.id < 100
              ? `0${pokemon.id}`
              : pokemon.id}
          </p>
          <p className="my-2 text-5xl font-bold capitalize ">{pokemon.name}</p>
          {englishGenus && <span>The {englishGenus?.genus}</span>}
          <div className="mt-4 flex justify-center gap-4">
            {pokemon.types.map((type) => {
              const matchingType = PokemonTypes.filter(
                (pokemonType) => pokemonType.name === type.type.name
              )[0];
              return (
                <Link
                  key={type.type.name}
                  href={`/types/${type.type.name}`}
                  style={{ backgroundColor: matchingType?.color }}
                  className="rounded-full p-2 shadow-md shadow-black transition hover:opacity-80"
                >
                  <Image
                    src={`/typeImages/${type.type.name}.svg`}
                    alt={type.type.name}
                    height={50}
                    width={50}
                  />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col pb-2">
          <Image
            priority
            src={pokemon.sprites.other["official-artwork"].front_default}
            width={475}
            height={475}
            alt={pokemon.name}
          />

          <div className="my-2 flex flex-col">
            <p className="text-xl font-semibold">Other Forms:</p>
            <p className="mt-2 text-xl">Shiny:</p>
            <Image
              height={200}
              width={200}
              src={pokemon.sprites.other["official-artwork"].front_shiny}
              alt={pokemon.name + " shiny"}
              title={pokemon.name + " shiny"}
            />
          </div>
        </div>
      </div>
    </>
  );
}
