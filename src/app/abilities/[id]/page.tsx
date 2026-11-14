import AbilityInfo from "@/components/abilityPage/AbilityInfo";
import AbilityPokemon from "@/components/abilityPage/AbilityPokemon";
import { pokeapi, slugOrNotFound } from "@/lib/pokeapi";
import { resolveRefs } from "@/lib/pokemon-index";
import { AbilityData } from "@/types/abilityTypes";

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
  const ability = await pokeapi<AbilityData>(`ability/${slugOrNotFound(id)}`);
  const pokemon = resolveRefs((ability.pokemon ?? []).map((p) => p.pokemon));

  return (
    <main className="min-h-screen px-4 py-12">
      <AbilityInfo ability={ability} />
      <AbilityPokemon pokemon={pokemon} />
    </main>
  );
}
