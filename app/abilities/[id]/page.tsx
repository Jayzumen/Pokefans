import { PokemonData } from "@/types/pokemonTypes";
import { AbilityData } from "../../../types/abilityTypes";
import AbilityInfo from "./components/AbilityInfo";
import AbilityPokemon from "./components/AbilityPokemon";

async function getAbilityData(id: string): Promise<AbilityData> {
  const abilityRes = await fetch(`https://pokeapi.co/api/v2/ability/${id}`, {
    next: { revalidate: 30 },
  });
  const abilityData: AbilityData = await abilityRes?.json();
  const pokemonData: PokemonData[] = await Promise.all(
    abilityData?.pokemon?.map(async (pokemon) => {
      const pokemonRes = await fetch(pokemon.pokemon.url);
      const data: PokemonData = await pokemonRes?.json();
      return data;
    })
  );
  return { ...abilityData, pokemonData };
}

export async function generateStaticParams() {
  const res = await fetch("https://pokeapi.co/api/v2/ability?limit=1");
  const data = await res?.json();
  const params = data.results.map((ability: { name: string; url: string }) => ({
    id: ability.name,
  }));
  return params;
}

export default async function Ability({ params }: { params: { id: string } }) {
  const ability = await getAbilityData(params.id);

  if (ability) {
    return (
      <main className="min-h-screen px-4 pt-32 pb-4">
        <AbilityInfo ability={ability} />
        <AbilityPokemon ability={ability} />
      </main>
    );
  } else {
    return (
      <main className="mx-4">
        <h1 className="my-2 text-4xl font-bold capitalize underline">
          Ability not found
        </h1>
      </main>
    );
  }
}
