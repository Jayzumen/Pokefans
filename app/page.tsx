import Image from "next/image";
import Link from "next/link";
import { PokemonTypes } from "../assets/constants";
import { PokemonData, Species } from "../types/pokemonTypes";

async function getRandomPokemon() {
  const pokemon = [];
  for (let i = 0; i < 6; i++) {
    const randomId = Math.floor(Math.random() * 1008);
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const data: PokemonData = await res.json();
    const speciesRes = await fetch(data.species.url);
    const speciesData: Species = await speciesRes.json();
    pokemon.push({ ...data, speciesData });
  }
  return pokemon;
}

export default async function Home() {
  const randomPokemon: PokemonData[] = await getRandomPokemon();

  return (
    <main className="p-4">
      <h1 className="my-4 text-4xl font-bold underline">Pokéfans</h1>
      <div className="mx-auto flex max-w-[1200px] flex-wrap justify-center gap-4 capitalize text-black">
        {randomPokemon.map((pokemon) => (
          <div
            key={pokemon.name}
            className="min-w-[300px] rounded-lg bg-slate-400 p-4"
          >
            <h2 className="max-w-[280px] text-2xl font-semibold">
              {pokemon.name}
            </h2>
            <Link href={`pokemon/${pokemon.id}`}>
              <Image
                className="mx-auto"
                src={pokemon.sprites.other["official-artwork"].front_default}
                alt={pokemon.name}
                width={200}
                height={200}
              />
            </Link>
            <div className="flex justify-center gap-2 text-lg font-semibold">
              {pokemon.types.map((type) => {
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
