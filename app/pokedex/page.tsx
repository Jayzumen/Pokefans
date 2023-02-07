import { Pokemon, PokemonData, Species } from "@/types/pokemonTypes";
import SearchForm from "./SearchForm";

async function getDummyPokemon() {
  const pokemon = [];
  for (let i = 1; i <= 9; i++) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    const data: PokemonData = await res?.json();
    const speciesRes = await fetch(data.species.url);
    const speciesData: Species = await speciesRes?.json();
    pokemon.push({ ...data, speciesData });
  }
  return pokemon;
}

async function getAllPokemon() {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10500");
  const data = await res.json();
  const results: Pokemon[] = await data.results;
  return results;
}

export default async function Pokedex() {
  const defaultPokemon: PokemonData[] = await getDummyPokemon();
  const allPokemon: Pokemon[] = await getAllPokemon();
  return (
    <main className="min-h-screen px-4 pt-32 pb-4">
      <h1 className="my-2 text-4xl font-bold underline">Pokédex</h1>
      <SearchForm pokemon={defaultPokemon} allPokemon={allPokemon} />
    </main>
  );
}
