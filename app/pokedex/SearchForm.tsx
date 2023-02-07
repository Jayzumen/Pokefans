"use client";

import { useState } from "react";
import { Pokemon, PokemonData, Species } from "@/types/pokemonTypes";
import DefaultPokemon from "./DefaultPokemon";
import SearchedPokemon from "./SearchedPokemon";

export default function SearchForm({
  pokemon,
  allPokemon,
}: {
  pokemon: PokemonData[];
  allPokemon: Pokemon[];
}) {
  const [searchedPokemon, setSearchedPokemon] = useState<PokemonData[]>([]);
  const [search, setSearch] = useState("");

  const getPokemonByName = async (name: string) => {
    if (name.length > 1) {
      const pokemon = allPokemon.filter((pokemon) =>
        pokemon.name.includes(name.toLowerCase())
      );
      if (pokemon) {
        const res: PokemonData[] = await Promise.all(
          pokemon?.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            const data: PokemonData = await res?.json();
            const speciesRes = await fetch(data.species.url);
            const speciesData: Species = await speciesRes?.json();
            return { ...data, speciesData };
          })
        );
        return res;
      }
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pokemon = await getPokemonByName(search);
    if (pokemon) {
      setSearchedPokemon(pokemon);
      setSearch("");
    }
  };

  return (
    <>
      <form
        className="mx-auto mt-10 flex max-w-[500px] flex-col gap-y-4 px-2 text-xl"
        onSubmit={handleSubmit}
      >
        <label htmlFor="search">Search for a Pokémon</label>
        <input
          className="rounded-full px-4 py-2 text-black shadow-md shadow-sky-700 outline-none"
          type="search"
          id="search"
          name="search"
          placeholder="Enter a Pokémon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="submit"
          className="mx-auto w-fit rounded-md bg-purple-900 py-2 px-6 text-white transition hover:bg-slate-300 hover:text-black disabled:bg-sky-700 disabled:text-gray-200"
        >
          Search
        </button>
      </form>
      {searchedPokemon?.length === 0 ? (
        <DefaultPokemon pokemon={pokemon} />
      ) : (
        <SearchedPokemon pokemon={searchedPokemon} />
      )}
    </>
  );
}
