import { AbilityData } from "@/types/abilityTypes";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function AbilityPokemon({ ability }: { ability: AbilityData }) {
  return (
    <>
      <p className="py-4 text-2xl font-bold">Pokemon with the ability:</p>
      <div className="flex flex-wrap gap-8 p-4">
        {ability.pokemon.map((pokemon, index) => (
          <Link
            key={index}
            href={`/pokemon/${pokemon.pokemon.name}`}
            className="mx-auto flex min-w-[250px] flex-col items-center justify-center rounded-lg bg-slate-600 py-2 text-xl font-semibold transition hover:bg-slate-700"
          >
            <p className="mx-auto max-w-[200px] capitalize">
              {pokemon.pokemon.name}
            </p>
            <Image
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
                pokemon.pokemon.url.split("/")[6]
              }.png`}
              alt={pokemon.pokemon.name}
              width={200}
              height={200}
            />
          </Link>
        ))}
      </div>
    </>
  );
}

export default AbilityPokemon;
