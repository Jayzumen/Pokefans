import { PokemonData, Species } from "../types/pokemonTypes";
import RandomPokemon from "./RandomPokemon";

async function getRandomPokemon() {
  const pokemon = [];
  for (let i = 0; i < 6; i++) {
    const randomId = Math.floor(Math.random() * 1008);
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const data: PokemonData = await res?.json();
    const speciesRes = await fetch(data.species.url);
    const speciesData: Species = await speciesRes?.json();
    pokemon.push({ ...data, speciesData });
  }
  return pokemon;
}

export default async function Home() {
  const randomPokemon: PokemonData[] = await getRandomPokemon();

  return (
    <main className="p-4">
      <h1 className="my-4 text-4xl font-bold underline">Pokéfans</h1>
      <RandomPokemon randomPokemon={randomPokemon} />
    </main>
  );
}
