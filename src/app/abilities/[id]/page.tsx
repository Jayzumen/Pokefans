import AbilityInfo from "@/components/abilityPage/AbilityInfo";
import AbilityPokemon from "@/components/abilityPage/AbilityPokemon";
import { mapLimit, pokeapi, slugOrNotFound } from "@/lib/pokeapi";
import { AbilityData } from "@/types/abilityTypes";
import { PokemonData } from "@/types/pokemonTypes";

async function getAbilityData(id: string): Promise<AbilityData> {
  const abilityData = await pokeapi<AbilityData>(`ability/${id}`);
  const pokemonData = await mapLimit(abilityData.pokemon ?? [], 12, (p) =>
    pokeapi<PokemonData>(p.pokemon.url),
  );
  return { ...abilityData, pokemonData };
}

// Pages are rendered on first request and then cached (ISR).
export async function generateStaticParams() {
  return [];
}

export default async function Ability({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ability = await getAbilityData(slugOrNotFound(id));

  return (
    <main className="min-h-screen px-4 py-12">
      <AbilityInfo ability={ability} />
      <AbilityPokemon ability={ability} />
    </main>
  );
}
