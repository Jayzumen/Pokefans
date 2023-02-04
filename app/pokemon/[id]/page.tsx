import Image from "next/image";
import Link from "next/link";
import { PokemonTypes } from "../../../assets/constants";
import { PokemonData, Species } from "../../../types/pokemonTypes";

async function getPokemonData(pokemonId: string) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
  const pokemonData: PokemonData = await res?.json();
  const speciesRes = await fetch(pokemonData.species.url);
  const speciesData: Species = await speciesRes?.json();
  return { ...pokemonData, speciesData };
}

export default async function Pokemon({ params }: { params: { id: string } }) {
  const pokemon: PokemonData = await getPokemonData(params?.id);

  const englishEntry = pokemon.speciesData.flavor_text_entries.find(
    (entry: any) => entry.language.name === "en"
  );

  if (pokemon) {
    return (
      <main className="px-4">
        <h1 className="my-2 text-4xl font-bold capitalize underline">
          {pokemon.name}
        </h1>
        <div className="flex flex-col md:flex-row">
          <div className="flex flex-col items-center pb-2">
            <Image
              priority
              src={pokemon.sprites.other["official-artwork"].front_default}
              width={475}
              height={475}
              alt={pokemon.name}
            />
            <div className="flex gap-4 text-lg font-semibold capitalize">
              {pokemon.types.map((type) => {
                const matchingType = PokemonTypes.filter(
                  (pokemonType) => pokemonType.name === type.type.name
                )[0];
                return (
                  <Link
                    key={type.type.name}
                    href={`/types/${type.type.name}`}
                    className={`min-w-[100px] rounded-lg py-2 text-black transition hover:opacity-80 ${matchingType.color}`}
                  >
                    {type.type.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="p-2">
            <div>
              <p className="text-2xl font-semibold">Abilities</p>
              <div className="flex flex-col gap-2 capitalize">
                {pokemon.abilities.map((ability, index: number) => (
                  <Link
                    href={`/abilities/${ability.ability.name}`}
                    key={index}
                    className="mx-auto w-fit transition hover:underline"
                  >
                    {ability.ability.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="py-2">
              <p className="text-2xl font-semibold">Pokédex Entry</p>
              <p className="mx-auto max-w-[300px] py-2">
                {englishEntry && englishEntry.flavor_text.replace(/\f/g, " ")}
              </p>
            </div>
            <div>
              <p className="text-2xl font-semibold">Stats</p>
              <div className="flex flex-col gap-2">
                {pokemon.stats.map((stat) => (
                  <div
                    key={stat.stat.name}
                    className="flex justify-between gap-4"
                  >
                    <span className="capitalize">{stat.stat.name}</span>
                    <span>{stat.base_stat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } else {
    return (
      <main className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Pokemon not found</h1>
        <Link href="/">Go back home</Link>
      </main>
    );
  }
}
