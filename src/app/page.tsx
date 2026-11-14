import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturedPokemon from "@/components/FeaturedPokemon";
import QuickLinks from "@/components/QuickLinks";
import { pokemonOfTheDay } from "@/lib/pokemon-index";

// The featured set is seeded by the date; re-check hourly so it rolls over
// shortly after midnight UTC. No PokeAPI requests needed.
export const revalidate = 3600;

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <QuickLinks />
      <FeaturedPokemon pokemon={pokemonOfTheDay(6)} />
      <Footer />
    </main>
  );
}
