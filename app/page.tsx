import Image from "next/image";
import Link from "next/link";
import { PokemonTypes } from "./constants";

const getRandomPokemon = async () => {
  const pokemon = [];
  for (let i = 0; i < 6; i++) {
    const randomId = Math.floor(Math.random() * 1008);
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await res.json();
    pokemon.push(data);
  }
  return pokemon;
};

export default async function Home() {
  const randomPokemon = await getRandomPokemon();

  return (
    <main className="px-4">
      <h1 className="my-4 text-4xl font-bold underline">Pokéfans</h1>
      <div className="mx-auto flex max-w-[1200px] flex-wrap justify-center gap-4 capitalize text-black">
        {randomPokemon.map((pokemon: any) => (
          <div
            key={pokemon.name}
            className="min-w-[300px] rounded-lg bg-slate-400 p-4"
          >
            <h2 className="max-w-[280px] text-2xl font-semibold">
              {pokemon.name}
            </h2>
            <Link href={`pokemon/${pokemon.name}`}>
              <Image
                className="mx-auto"
                src={pokemon.sprites.other["official-artwork"].front_default}
                alt={pokemon.name}
                width={200}
                height={200}
              />
            </Link>
            <div className="flex justify-center gap-2 text-lg font-semibold">
              {pokemon.types.map((type: any) => {
                const matchingType = PokemonTypes.filter(
                  (pokemonType) => pokemonType.name === type.type.name
                )[0];
                return (
                  <p
                    key={type.type.name}
                    className={`min-w-[100px] rounded-lg p-1 ${matchingType.color}`}
                  >
                    {type.type.name}
                  </p>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
