import Link from "next/link";
import { Generations } from "@/assets/constants";
import { Pokemon } from "@/types/pokemonTypes";
import { GenPokemonData } from "@/types/generationTypes";
import PokemonLayout from "@/components/generationsPage/PokemonLayout";

async function getGenPokemon(gen: string) {
  const generation = Generations.find((generation) => generation.id === gen);
  const res = await fetch(
    ` https://pokeapi.co/api/v2/pokemon?limit=${generation?.limit}&offset=${generation?.offset}`,
  );
  const data = await res?.json();
  const pokemon: GenPokemonData[] = await Promise.all(
    data.results.map(async (pokemon: Pokemon) => {
      const res = await fetch(pokemon.url);
      const data = await res?.json();
      return data;
    }),
  );
  return pokemon;
}

export async function generateStaticParams() {
  const res = await fetch("https://pokeapi.co/api/v2/generation?limit=1");
  const data = await res?.json();
  const params = data.results.map((gen: { name: string; url: string }) => ({
    gen: gen.url.split("/")[6].toString(),
  }));
  return params;
}

export default async function GenerationsPage({
  params,
}: {
  params: { gen: string };
}) {
  const data: GenPokemonData[] = await getGenPokemon(params.gen);

  if (data) {
    return <PokemonLayout data={data} />;
  } else {
    return (
      <main className="px-4 pt-32 pb-4">
        <div className="flex flex-wrap gap-8 p-4">
          <p>No Pokemon found for this generation</p>
          <Link href="/">Go to home</Link>
        </div>
      </main>
    );
  }
}
