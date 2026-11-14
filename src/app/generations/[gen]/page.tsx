import { notFound } from "next/navigation";
import { Generations } from "@/assets/constants";
import { PokemonGrid } from "@/components/PokemonCard";
import { getPokemonByGen } from "@/lib/pokemon-index";

// Every generation is built at compile time from the static index.
export const dynamicParams = false;

export function generateStaticParams() {
  return Generations.map((g) => ({ gen: g.id }));
}

export default async function GenerationsPage({
  params,
}: {
  params: Promise<{ gen: string }>;
}) {
  const { gen } = await params;
  const generation = Generations.find((g) => g.id === gen);
  if (!generation) notFound();

  return (
    <div className="px-4 py-4">
      <PokemonGrid pokemon={getPokemonByGen(Number(gen))} />
    </div>
  );
}
