import Link from "next/link";
import { GenerationPokemon } from "../../../types/generationTypes";
import Image from "next/image";

async function getGenerationsData(gen: string) {
  const res = await fetch(`https://pokeapi.co/api/v2/generation/${gen}/`);
  const data = await res?.json();
  const pokemon = await Promise.all(
    data.pokemon_species.map(async (pokemon: any) => {
      const res = await fetch(pokemon.url);
      const data = await res?.json();

      return {
        name: data.name,
        id: data.id,
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
    return (
      <main className="px-4">
        <div className="flex flex-wrap gap-8 p-4">
          {data
            .sort((a, b) => (a.id > b.id ? 1 : -1))
            .map((pokemon) => (
              <Link
                key={pokemon.name}
                href={`/pokemon/${pokemon.name}`}
                className="mx-auto flex min-w-[250px] flex-col items-center justify-center rounded-lg bg-slate-600 py-2 text-xl font-semibold transition hover:bg-slate-700"
              >
                <p>
                  #
                  {pokemon.id < 10
                    ? `00${pokemon.id}`
                    : pokemon.id < 100
                    ? `0${pokemon.id}`
                    : pokemon.id}
                </p>

                <p className="text-xl font-semibold capitalize">
                  {pokemon.name}
                </p>
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
  } else {
    return (
      <main className="px-4">
        <div className="flex flex-wrap gap-8 p-4">
          <p>Nno Pokemon found for this generation</p>
          <Link href="/">Go to home</Link>
        </div>
      </main>
    );
  }
}
