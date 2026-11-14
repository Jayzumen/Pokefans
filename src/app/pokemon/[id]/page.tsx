import { PokemonTypes } from "@/assets/constants";
import PokemonEvoChain from "@/components/pokemonPage/PokemonEvoChain";
import PokemonImage from "@/components/pokemonPage/PokemonImage";
import PokemonInfo from "@/components/pokemonPage/PokemonInfo";
import PokemonStats from "@/components/pokemonPage/PokemonStats";
import { pokeapi, slugOrNotFound } from "@/lib/pokeapi";
import { EvolutionChain, PokemonData, Species } from "@/types/pokemonTypes";

async function getPokemonData(pokemonId: string): Promise<PokemonData> {
  const pokemonData = await pokeapi<PokemonData>(`pokemon/${pokemonId}`);
  const speciesData = await pokeapi<Species>(pokemonData.species.url);
  const evoChainData = speciesData.evolution_chain?.url
    ? await pokeapi<EvolutionChain>(speciesData.evolution_chain.url)
    : undefined;
  return { ...pokemonData, speciesData, evoChainData };
}

// Pages are rendered on first request and then cached (ISR).
export async function generateStaticParams() {
  return [];
}

export default async function Pokemon({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pokemon = await getPokemonData(slugOrNotFound(id));

  const matchingTypes = pokemon.types.map((type) =>
    PokemonTypes.find((pokemonType) => pokemonType.name === type.type.name),
  );
  return (
    <main
      style={{
        background: `linear-gradient(180deg, ${matchingTypes[0]?.color ?? "#737373"} 0%, ${
          matchingTypes[1]?.color ?? "white"
        } 100%)`,
      }}
      className="px-4 py-12 text-neutral-950"
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
