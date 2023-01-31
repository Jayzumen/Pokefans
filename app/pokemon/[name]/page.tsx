import Image from "next/image";
import { PokemonTypes } from "../../../assets/constants";
import { PokemonData, Species } from "../../../types/pokemonTypes";

async function getPokemonData(pokemonName: string) {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`
  );
  const speciesData: Species = await res.json();
  const pokemonRes = await fetch(speciesData.varieties[0].pokemon.url);
  const pokemonData: PokemonData = await pokemonRes.json();
  return { ...speciesData, pokemonData };
}

export default async function Pokemon({
  params,
}: {
  params: { name: string };
}) {
  const pokemon: Species = await getPokemonData(params.name);

  const englishEntry = pokemon.flavor_text_entries.find(
    (entry: any) => entry.language.name === "en"
  );

  return (
    <main className="px-4">
      <h1 className="my-2 text-4xl font-bold capitalize underline">
        {pokemon.name}
      </h1>
      <div className="flex flex-col md:flex-row">
        <div className="flex flex-col items-center pb-2">
          <Image
            priority
            src={
              pokemon.pokemonData.sprites.other["official-artwork"]
                .front_default
            }
            width={475}
            height={475}
            alt={pokemon.name}
          />
          <div className="flex gap-4 text-lg font-semibold capitalize">
            {pokemon.pokemonData.types.map((type: any) => {
              const matchingType = PokemonTypes.filter(
                (pokemonType) => pokemonType.name === type.type.name
              )[0];
              return (
                <span
                  key={type.type.name}
                  className={` min-w-[100px] rounded-lg p-2  ${matchingType.color}`}
                >
                  {type.type.name}
                </span>
              );
            })}
          </div>
        </div>
        <div className="p-2">
          <div>
            <p className="text-2xl font-semibold">Abilities</p>
            <div className="flex flex-col gap-2 capitalize">
              {pokemon.pokemonData.abilities.map(
                (ability: any, index: number) => (
                  <span key={index}>{ability.ability.name}</span>
                )
              )}
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
              {pokemon.pokemonData.stats.map((stat: any) => (
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
}
