import Link from "next/link";
import { GenerationPokemon } from "../../../types/generationTypes";
import PokemonLayout from "./PokemonLayout";

async function getGenerationsData(gen: string): Promise<GenerationPokemon[]> {
  const res = await fetch(`https://pokeapi.co/api/v2/generation/${gen}/`);
  const data = await res?.json();
  const pokemon = await Promise.all(
    data.pokemon_species.map(async (pokemon: any) => {
      const res = await fetch(pokemon.url);
      const data = await res?.json();

      return {
        id: data.id,
        speciesName: data.name,
        name: data.varieties[0].pokemon.name,
      };
    })
  );

  return pokemon;
}

export default async function GenerationsPage({
  params,
}: {
  params: { gen: string };
}) {
  const data: GenerationPokemon[] = await getGenerationsData(params?.gen);

  if (data) {
    return <PokemonLayout data={data} />;
  } else {
    return (
      <main className="px-4">
        <div className="flex flex-wrap gap-8 p-4">
          <p>No Pokemon found for this generation</p>
          <Link href="/">Go to home</Link>
        </div>
      </main>
    );
  }
}
