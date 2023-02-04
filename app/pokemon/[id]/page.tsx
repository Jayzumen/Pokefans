import Link from "next/link";
import { PokemonData, Species } from "../../../types/pokemonTypes";
import PokemonImage from "./PokemonImage";
import PokemonInfo from "./PokemonInfo";

async function getPokemonData(pokemonId: string) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
  const pokemonData: PokemonData = await res?.json();
  const speciesRes = await fetch(pokemonData.species.url);
  const speciesData: Species = await speciesRes?.json();
  return { ...pokemonData, speciesData };
}

export default async function Pokemon({ params }: { params: { id: string } }) {
  const pokemon: PokemonData = await getPokemonData(params?.id);

  if (pokemon) {
    return (
      <main className="px-4">
        <h1 className="my-2 text-4xl font-bold capitalize underline">
          {pokemon.name}
        </h1>
        <div className="flex flex-col md:flex-row md:gap-10">
          <PokemonImage pokemon={pokemon} />
          <PokemonInfo pokemon={pokemon} />
        </div>
      </main>
    );
  } else {
    return (
      <main className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Pokemon not found</h1>
        <Link href="/">Go back home</Link>
      </main>
    );
  }
}
