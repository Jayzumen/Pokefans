import { PokemonData } from "@/types/pokemonTypes";
import Link from "next/link";
import React from "react";

export default function PokemonInfo({ pokemon }: { pokemon: PokemonData }) {
  const englishEntry = pokemon.speciesData.flavor_text_entries.find(
    (entry: any) => entry.language.name === "en"
  );
  return (
    <div className="p-2 md:w-[50%]">
      <p className="pb-4 text-3xl font-semibold">Info</p>
      <div className="py-2">
        <p className="text-2xl font-semibold">Pokédex Entry:</p>
        <p className="mx-auto min-h-[200px] max-w-[300px] py-2">
          {englishEntry && englishEntry.flavor_text.replace(/\f/g, " ")}
        </p>
        <div>
          {pokemon.speciesData.is_baby && <p>Baby Pokémon</p>}
          {pokemon.speciesData.is_legendary && <p>Legendary Pokémon</p>}
          {pokemon.speciesData.is_mythical && <p>Mythical Pokémon</p>}
        </div>
        <div className="flex flex-col justify-center gap-4 py-4 sm:flex-row">
          <p className="text-2xl font-semibold">Height:</p>
          <p className="text-2xl">{pokemon.height / 10} m</p>

          <p className="text-2xl font-semibold">Weight:</p>
          <p className="text-2xl">{pokemon.weight / 10} kg</p>
        </div>
      </div>

      <div>
        <p className="pb-2 text-2xl font-semibold">Abilities:</p>
        <div className="flex flex-col gap-2 text-2xl capitalize">
          {pokemon.abilities.map((ability, index: number) => (
            <Link
              href={`/abilities/${ability.ability.name}`}
              key={index}
              className="mx-auto w-fit transition hover:underline"
            >
              {ability.is_hidden ? (
                <p>
                  {ability.ability.name}{" "}
                  <span className="text-sm"> (hidden)</span>
                </p>
              ) : (
                <p>{ability.ability.name}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
