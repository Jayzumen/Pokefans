import { PokemonTypes } from "@/assets/constants";
import { PokemonData } from "@/types/pokemonTypes";
import Image from "next/image";
import Link from "next/link";

export default function DefaultPokemon({
  pokemon,
}: {
  pokemon: PokemonData[];
}) {
  return (
    <div className="mx-auto my-4 flex max-w-[1200px] flex-wrap gap-8 capitalize">
      {pokemon.map((pokemon) => {
        const matchingTypes = pokemon.types.map((type) => {
          return PokemonTypes.filter(
            (pokemonType) => pokemonType.name === type.type.name
          )[0];
        });
        return (
          <div
            style={{
              background: `linear-gradient(180deg, ${
                matchingTypes[0].color
              } 0%, ${
                matchingTypes[1] ? matchingTypes[1]?.color : "white"
              } 100%)`,
            }}
            className="mx-auto min-w-[280px] rounded-lg p-2"
            key={pokemon.id}
          >
            <h2 className="max-w-[250px] text-lg font-semibold">
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
                    href={`/types/${type.type.name}`}
                    key={type.type.name}
                    style={{ backgroundColor: matchingType.color }}
                    className="rounded-full p-2 shadow-md shadow-black"
                  >
                    <Image
                      src={`/typeImages/${type.type.name}.svg`}
                      alt={type.type.name}
                      height={50}
                      width={50}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
