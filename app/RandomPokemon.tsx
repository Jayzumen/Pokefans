import Image from "next/image";
import Link from "next/link";
import { PokemonData } from "@/types/pokemonTypes";
import { PokemonTypes } from "@/assets/constants";

export default function RandomPokemon({
  randomPokemon,
}: {
  randomPokemon: PokemonData[];
}) {
  return (
    <>
      <p className="mt-10 mb-4 text-2xl font-semibold">Random Pokémon:</p>
      <div className="mx-auto flex max-w-[1200px] flex-wrap justify-center gap-4 capitalize text-black">
        {randomPokemon.map((pokemon, index) => {
          const matchingTypes = pokemon.types.map((type) => {
            return PokemonTypes.filter(
              (pokemonType) => pokemonType.name === type.type.name
            )[0];
          });

          return (
            <div
              key={index}
              style={{
                background: `linear-gradient(180deg, ${
                  matchingTypes[0].color
                } 0%, ${
                  matchingTypes[1] ? matchingTypes[1]?.color : "white"
                } 100%)`,
              }}
              className={`min-w-[300px] rounded-lg p-4`}
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
                {pokemon.types.map((type) => {
                  const matchingType = PokemonTypes.filter(
                    (pokemonType) => pokemonType.name === type.type.name
                  )[0];
                  return (
                    <Link
                      key={type.type.name}
                      href={`/types/${type.type.name}`}
                      style={{ backgroundColor: matchingType?.color }}
                      className={`rounded-full p-2 shadow-md shadow-black transition hover:opacity-80`}
                    >
                      <Image
                        src={`/typeImages/${type.type.name}.svg`}
                        alt={type.type.name}
                        height={30}
                        width={30}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
