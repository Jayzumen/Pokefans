import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturedPokemon from "@/components/FeaturedPokemon";
import QuickLinks from "@/components/QuickLinks";
import { PokemonData } from "@/types/pokemonTypes";
import { MAX_POKEMON_ID, pokeapi, randomIds } from "@/lib/pokeapi";

// Re-pick the featured Pokémon once per hour.
export const revalidate = 3600;

async function getRandomPokemon() {
  return Promise.all(
    randomIds(6, MAX_POKEMON_ID).map((id) =>
      pokeapi<PokemonData>(`pokemon/${id}`),
    ),
  );
}

export default async function Home() {
  const randomPokemon = await getRandomPokemon();

  return (
    <main className="min-h-screen">
      <HeroSection />
      <QuickLinks />
      <FeaturedPokemon randomPokemon={randomPokemon} />
      <Footer />
    </main>
  );
}
