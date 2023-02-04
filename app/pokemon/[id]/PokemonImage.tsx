import { PokemonTypes } from "@/assets/constants";
import { PokemonData } from "@/types/pokemonTypes";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function PokemonImage({ pokemon }: { pokemon: PokemonData }) {
  return (
    <>
      <div className="flex flex-col md:flex-row">
        <div className="flex flex-col items-center pb-2">
          <Image
            priority
            src={pokemon.sprites.other["official-artwork"].front_default}
            width={475}
            height={475}
            alt={pokemon.name}
          />
          <div className="flex gap-4 text-lg font-semibold capitalize">
            {pokemon.types.map((type) => {
              const matchingType = PokemonTypes.filter(
                (pokemonType) => pokemonType.name === type.type.name
              )[0];
              return (
                <Link
                  key={type.type.name}
                  href={`/types/${type.type.name}`}
                  className={`min-w-[100px] rounded-lg py-2 text-black transition hover:opacity-80 ${matchingType.color}`}
                >
                  {type.type.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default PokemonImage;
