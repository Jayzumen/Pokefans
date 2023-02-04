import { GenerationPokemon } from "@/types/generationTypes";
import React from "react";
import Image from "next/image";
import Link from "next/link";

function PokemonLayout({ data }: { data: GenerationPokemon[] }) {
  return (
    <main className="px-4">
      <div className="flex flex-wrap gap-8 p-4">
        {data
          .sort((a, b) => (a.id > b.id ? 1 : -1))
          .map((pokemon) => (
            <Link
              key={pokemon.name}
              href={`/pokemon/${pokemon.name}`}
              className="mx-auto flex min-w-[250px] flex-col items-center justify-center rounded-lg bg-slate-600 py-2 text-xl font-semibold transition hover:bg-slate-700"
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
                {pokemon.speciesName}
              </p>
              <Image
                loading="lazy"
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                alt={pokemon.name}
                width={200}
                height={200}
                className="rounded-lg"
              />
            </Link>
          ))}
      </div>
    </main>
  );
}

export default PokemonLayout;
