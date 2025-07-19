import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturedPokemon from "@/components/FeaturedPokemon";
import QuickLinks from "@/components/QuickLinks";
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
    <main className="min-h-screen">
      <HeroSection />
      <QuickLinks />
      <FeaturedPokemon randomPokemon={randomPokemon} />
      <Footer />
    </main>
  );
}