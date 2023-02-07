import { PokemonTypes } from "@/assets/constants";
import {
  EvolutionChain,
  PokemonData,
  Species,
} from "../../../types/pokemonTypes";
import PokemonEvoChain from "./PokemonEvoChain";
import PokemonImage from "./PokemonImage";
import PokemonInfo from "./PokemonInfo";
import PokemonStats from "./PokemonStats";

async function getPokemonData(pokemonId: string) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
  const pokemonData: PokemonData = await res?.json();
  const speciesRes = await fetch(pokemonData.species.url);
  const speciesData: Species = await speciesRes?.json();
  let evoChainData: EvolutionChain | undefined;
  if (speciesData.evolution_chain?.url) {
    const evoChainRes = await fetch(speciesData.evolution_chain.url);
    evoChainData = await evoChainRes?.json();
  }
  return { ...pokemonData, speciesData, evoChainData };
}

export async function generateStaticParams() {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1");
  const data = await res?.json();
  const params = data.results.map((pokemon: { name: string; url: string }) => ({
    id: pokemon.name,
  }));
  return params;
}

export default async function Pokemon({ params }: { params: { id: string } }) {
  const pokemon: PokemonData = await getPokemonData(params?.id);

  const matchingTypes = pokemon.types.map((type) => {
    return PokemonTypes.filter(
      (pokemonType) => pokemonType.name === type.type.name
    )[0];
  });
  return (
    <main
      style={{
        background: `linear-gradient(180deg, ${matchingTypes[0].color} 0%, ${
          matchingTypes[1] ? matchingTypes[1]?.color : "white"
        } 100%)`,
      }}
      className="px-4 pt-32 pb-4"
    >
      <div className="flex w-full flex-col">
        <PokemonImage pokemon={pokemon} />

        <div className="my-2 rounded-md bg-slate-700 p-4 text-white lg:m-4">
          <div className="mx-auto mt-2 flex flex-col text-lg md:mt-0 md:flex-row md:justify-between">
            <PokemonInfo pokemon={pokemon} />
            <div className="md:w-[50%]">
              <PokemonStats pokemon={pokemon} />
            </div>
          </div>
          {pokemon.evoChainData && (
            <PokemonEvoChain evoChainData={pokemon.evoChainData} />
          )}
        </div>
      </div>
    </main>
  );
}
