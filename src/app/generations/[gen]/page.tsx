import { notFound } from "next/navigation";
import { Generations } from "@/assets/constants";
import { Pokemon } from "@/types/pokemonTypes";
import { GenPokemonData } from "@/types/generationTypes";
import PokemonLayout from "@/components/generationsPage/PokemonLayout";
import { mapLimit, pokeapi } from "@/lib/pokeapi";

async function getGenPokemon(genId: string) {
  const generation = Generations.find((g) => g.id === genId);
  if (!generation) notFound();

  const list = await pokeapi<{ results: Pokemon[] }>(
    `pokemon?limit=${generation.limit}&offset=${generation.offset}`,
  );
  return mapLimit(list.results, 12, (p) => pokeapi<GenPokemonData>(p.url));
}

// Pages are rendered on first request and then cached (ISR).
export async function generateStaticParams() {
  return [];
}

export default async function GenerationsPage({
  params,
}: {
  params: Promise<{ gen: string }>;
}) {
  const { gen } = await params;
  const data = await getGenPokemon(gen);
  return <PokemonLayout data={data} />;
}
