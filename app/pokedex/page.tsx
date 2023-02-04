import Image from "next/image";
import Link from "next/link";
import { PokemonTypes } from "../../assets/constants";
import { PokemonData, Species } from "../../types/pokemonTypes";

async function getDummyPokemon() {
  const pokemon = [];
  for (let i = 1; i < 19; i++) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    const data: PokemonData = await res?.json();
    const speciesRes = await fetch(data.species.url);
    const speciesData: Species = await speciesRes?.json();
    pokemon.push({ ...data, speciesData });
  }
  return pokemon;
}

export default async function Pokedex() {
  const pokemon = await getDummyPokemon();
  return (
    <main className="px-4">
      <h1 className="my-2 text-4xl font-bold underline">Pokédex</h1>
      <form className="mx-auto mt-10 flex max-w-[500px] flex-col gap-y-4 px-2 text-xl">
        <label htmlFor="search">Search for a Pokémon</label>
        <input
          className="rounded-full px-4 py-2 text-black shadow-md shadow-sky-700 outline-none"
          type="search"
          id="search"
          name="search"
          placeholder="Enter a Pokemon..."
        />

        <button
          type="submit"
          className="mx-auto w-fit rounded-md bg-purple-900 py-2 px-6 text-white transition hover:bg-slate-300 hover:text-black disabled:bg-sky-700 disabled:text-gray-200"
        >
          Search
        </button>
      </form>

      <div className="mx-auto my-4 flex max-w-[1200px] flex-wrap gap-8 capitalize">
        {pokemon.map((pokemon) => (
          <div
            className="mx-auto min-w-[300px] rounded-lg bg-slate-500 p-2 "
            key={pokemon.id}
          >
            <h2 className="max-w-[280px] text-lg font-semibold">
              {pokemon.name}
            </h2>
            <Link href={`/pokemon/${pokemon.name}`}>
              <Image
                className="mx-auto"
                width={200}
                height={200}
                src={pokemon.sprites.other["official-artwork"].front_default}
                alt={pokemon.name}
              />
            </Link>
            <div className="flex justify-center gap-2 text-lg font-semibold">
              {pokemon.types.map((type) => {
                const matchingType = PokemonTypes.filter(
                  (pokemonType) => pokemonType.name === type.type.name
                )[0];
                return (
                  <Link
                    href={`/type/${type.type.name}`}
                    key={type.type.name}
                    className={`min-w-[100px] rounded-lg p-1 ${matchingType.color}`}
                  >
                    {type.type.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
