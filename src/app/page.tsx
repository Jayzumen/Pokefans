import Bento from "@/components/home/Bento";
import Hero from "@/components/home/Hero";
import { Container, Section } from "@/components/layout";
import { PokemonGrid } from "@/components/PokemonCard";
import names from "@/data/names.json";
import { pokemonIndex, pokemonOfTheDay } from "@/lib/pokemon-index";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// The featured set is seeded by the date; re-check hourly so it rolls over
// shortly after midnight UTC.
export const revalidate = 3600;

// Totals come from the static data: no network request, even at build time.
const counts = {
  pokemon: pokemonIndex.length,
  moves: names.moves.length,
  abilities: names.abilities.length,
};

export default function Home() {
  const [star, ...featured] = pokemonOfTheDay(7);

  return (
    <main>
      <Hero
        star={star}
        stats={[
          { label: "Pokémon", value: counts.pokemon },
          { label: "Moves", value: counts.moves },
          { label: "Abilities", value: counts.abilities },
          { label: "Types", value: 18 },
        ]}
      />
      <Container>
        <Section
          title="Explore"
          description="Everything in the Pokémon world, one tap away."
        >
          <Bento counts={counts} />
        </Section>
        <Section
          title="Today’s picks"
          description="A fresh selection every day."
          action={
            <Button asChild variant="outline" className="group rounded-full">
              <Link href="/pokedex">
                All Pokémon
                <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </Button>
          }
        >
          <PokemonGrid
            pokemon={featured}
            className="sm:grid-cols-3 lg:grid-cols-6"
          />
        </Section>
      </Container>
    </main>
  );
}
