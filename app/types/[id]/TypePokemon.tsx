import { TypeData } from "@/types/typeTypes";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function TypePokemon({ typeData }: { typeData: TypeData }) {
  return (
    <div className="my-4">
      <h2 className="my-2 text-2xl font-bold">Pokemon with this Type:</h2>
      <div className="flex flex-wrap justify-center gap-2 px-2">
        {typeData.pokemon.map((pokemon, index) => (
          <Link
            key={index}
            className="flex min-h-[250px] flex-col items-center rounded-lg bg-slate-400 p-2 capitalize"
            href={`/pokemon/${pokemon.pokemon.name}`}
          >
            <p className="mx-auto min-h-[70px] max-w-[170px] text-xl font-semibold">
              {pokemon.pokemon.name}
            </p>
            <Image
              loading="lazy"
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
                pokemon.pokemon.url.split("/")[6]
              }.png`}
              width={200}
              height={200}
              alt={pokemon.pokemon.name}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default TypePokemon;
