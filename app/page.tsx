import Image from "next/image";
import Link from "next/link";
import { PokemonTypes } from "../assets/constants";
import { PokemonData, Species } from "../types/pokemonTypes";

async function getRandomPokemon() {
  const pokemon = [];
  for (let i = 0; i < 6; i++) {
    const randomId = Math.floor(Math.random() * 1008);
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${randomId}`
    );
    const data: Species = await res.json();
    const pokemonRes = await fetch(data.varieties[0].pokemon.url);
    const pokemonData: PokemonData = await pokemonRes.json();
    pokemon.push({ ...data, pokemonData });
  }
  return pokemon;
}

export default async function Home() {
  const randomPokemon: Species[] = await getRandomPokemon();

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
            <Link href={`pokemon/${pokemon.name}`}>
              <Image
                className="mx-auto"
                src={
                  pokemon.pokemonData.sprites.other["official-artwork"]
                    .front_default
                }
                alt={pokemon.name}
                width={200}
                height={200}
              />
            </Link>
            <div className="flex justify-center gap-2 text-lg font-semibold">
              {pokemon.pokemonData.types.map((type: any) => {
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
