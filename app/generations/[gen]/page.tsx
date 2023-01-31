import Link from "next/link";
import {
  AllGenerations,
  GenerationPokemon,
} from "../../../types/generationTypes";
import Image from "next/image";

async function getAllGenerations() {
  const res = await fetch("https://pokeapi.co/api/v2/generation/");
  const data = await res.json();
  return data;
}

async function getGenerationsData(gen: string) {
  const res = await fetch(`https://pokeapi.co/api/v2/generation/${gen}/`);
  const data = await res.json();
  const pokemon = await Promise.all(
    data.pokemon_species.map(async (pokemon: any) => {
      const res = await fetch(pokemon.url);
      const data = await res.json();

      return {
        name: data.name,
        id: data.id,
      };
    })
  );

  return pokemon;
}

export default async function Generations({
  params,
}: {
  params: { gen: string };
}) {
  const allGenerations: AllGenerations = await getAllGenerations();
  const data: GenerationPokemon[] = await getGenerationsData(params.gen);

  return (
    <main className="px-4">
      <h1 className="my-2 text-4xl font-bold underline">Generations</h1>
      <div className="flex flex-wrap justify-center gap-4 py-2">
        {allGenerations.results.map((gen) => (
          <Link
            key={gen.name}
            className="min-w-[100px] items-center justify-center rounded-lg bg-purple-800 py-2 text-xl font-semibold transition hover:bg-purple-700"
            href={`/generations/${gen.url.split("/")[6]}`}
          >
            {gen.name.split("-")[1].toUpperCase()}
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap gap-8 p-4">
        {data
          .sort((a, b) => (a.id > b.id ? 1 : -1))
          .map((pokemon) => (
            <Link
              key={pokemon.name}
              href={`/pokemon/${pokemon.name}`}
              className="mx-auto flex min-w-[250px] flex-col items-center justify-center rounded-lg bg-slate-600 py-2 text-xl font-semibold transition hover:bg-slate-700"
            >
              <p className="text-xl font-semibold "># {pokemon.id}</p>
              <p className="text-xl font-semibold capitalize">{pokemon.name}</p>
              <Image
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                alt={pokemon.name}
                width={200}
                height={200}
                className="rounded-lg"
              />
            </Link>
          ))}
      </div>
    </main>
  );
}
