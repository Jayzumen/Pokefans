import Image from "next/image";
import { PokemonTypes } from "./../../constants";

async function getPokemonData(pokemonName: string) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
  const pokemon = await res.json();
  const speciesRes = await fetch(pokemon.species.url);
  const species = await speciesRes.json();

  return { ...pokemon, species };
}

export default async function Pokemon({
  params,
}: {
  params: { name: string };
}) {
  const pokemon = await getPokemonData(params.name);
  console.log(pokemon);

  const englishEntry = pokemon.species.flavor_text_entries.find(
    (entry: any) => entry.language.name === "en"
  );

  return (
    <main className="px-4">
      <h1 className="my-2 text-4xl font-bold capitalize underline">
        {pokemon.name}
      </h1>
      <div className="flex flex-col md:flex-row">
        <div className="flex flex-col items-center">
          <Image
            priority
            src={pokemon.sprites.other["official-artwork"].front_default}
            width={475}
            height={475}
            alt={pokemon.name}
          />
          <div className="flex gap-4 text-lg font-semibold capitalize">
            {pokemon.types.map((type: any) => {
              const matchingType = PokemonTypes.filter(
                (pokemonType) => pokemonType.name === type.type.name
              )[0];
              return (
                <span
                  key={type.type.name}
                  className={` min-w-[100px] rounded-lg p-4  ${matchingType.color}`}
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
              {pokemon.abilities.map((ability: any) => (
                <span key={ability.ability.name}>{ability.ability.name}</span>
              ))}
            </div>
          </div>
          <div className="py-2">
            <p className="text-2xl font-semibold">Pokédex Entry</p>
            <p className="max-w-[300px] py-2">
              {englishEntry && englishEntry.flavor_text.replace(/\f/g, " ")}
            </p>
          </div>
          <div>
            <p className="text-2xl font-semibold">Stats</p>
            <div className="flex flex-col gap-2">
              {pokemon.stats.map((stat: any) => (
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
