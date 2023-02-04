import { PokemonData } from "@/types/pokemonTypes";
import Link from "next/link";
import React from "react";

function PokemonInfo({ pokemon }: { pokemon: PokemonData }) {
  const englishEntry = pokemon.speciesData.flavor_text_entries.find(
    (entry: any) => entry.language.name === "en"
  );
  return (
    <div className="p-2">
      <div>
        <p className="text-2xl font-semibold">Abilities</p>
        <div className="flex flex-col gap-2 capitalize">
          {pokemon.abilities.map((ability, index: number) => (
            <Link
              href={`/abilities/${ability.ability.name}`}
              key={index}
              className="mx-auto w-fit transition hover:underline"
            >
              {ability.ability.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="py-2">
        <p className="text-2xl font-semibold">Pokédex Entry</p>
        <p className="mx-auto max-w-[300px] py-2">
          {englishEntry && englishEntry.flavor_text.replace(/\f/g, " ")}
        </p>
      </div>
      <div>
        <p className="text-2xl font-semibold">Stats</p>
        <div className="flex flex-col gap-2">
          {pokemon.stats.map((stat) => (
            <div key={stat.stat.name} className="flex justify-between gap-4">
              <span className="capitalize">{stat.stat.name}</span>
              <span>{stat.base_stat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PokemonInfo;
