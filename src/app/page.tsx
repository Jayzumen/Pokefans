import Footer from "@/components/Footer";
import PageLinks from "@/components/PageLinks";
import RandomPokemon from "@/components/RandomPokemon";
import { PokemonData, Species } from "@/types/pokemonTypes";

async function getRandomPokemon() {
  const pokemon = [];
  for (let i = 0; i < 6; i++) {
    const randomId = Math.floor(Math.random() * 1008);
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`, {
      next: { revalidate: 30 },
    });
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
    <main className="px-4 pt-32">
      <h1 className="my-4 text-5xl font-bold underline">Welcome to Pokéfans</h1>
      <PageLinks />
      <RandomPokemon randomPokemon={randomPokemon} />
      <Footer />
    </main>
  );
}
