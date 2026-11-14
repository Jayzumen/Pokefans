import Bento from "@/components/home/Bento";
import Hero from "@/components/home/Hero";
import { Container, Section } from "@/components/layout";
import { PokemonGrid } from "@/components/PokemonCard";
import { pokeapi } from "@/lib/pokeapi";
import { pokemonIndex, pokemonOfTheDay } from "@/lib/pokemon-index";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// The featured set is seeded by the date; re-check hourly so it rolls over
// shortly after midnight UTC.
export const revalidate = 3600;

async function getCounts() {
  // Two tiny, week-cached requests just for the totals.
  const [moves, abilities] = await Promise.all([
    pokeapi<{ count: number }>("move?limit=1"),
    pokeapi<{ count: number }>("ability?limit=1"),
  ]);
  return {
    pokemon: pokemonIndex.length,
    moves: moves.count,
    abilities: abilities.count,
  };
}

export default async function Home() {
  const [star, ...featured] = pokemonOfTheDay(7);
  const counts = await getCounts();

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
