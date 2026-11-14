import SearchForm from "@/components/abilityPage/SearchForm";
import { Ability, AbilityData } from "@/types/abilityTypes";
import { pokeapi, randomIds } from "@/lib/pokeapi";

// Re-pick the random abilities once per hour.
export const revalidate = 3600;
const MAX_ABILITY_ID = 298;

async function randomAbilities() {
  return Promise.all(
    randomIds(10, MAX_ABILITY_ID).map((id) =>
      pokeapi<AbilityData>(`ability/${id}`),
    ),
  );
}

async function getAllAbilities() {
  const data = await pokeapi<{ results: Ability[] }>("ability?limit=400");
  return data.results;
}

export default async function AbilityPage() {
  const [randomAbilityData, allAbilities] = await Promise.all([
    randomAbilities(),
    getAllAbilities(),
  ]);

  return (
    <main className="min-h-screen px-4 py-12">
      <h1 className="my-2 text-4xl font-bold capitalize underline">
        Ability-Dex
      </h1>
      <SearchForm
        randomAbility={randomAbilityData}
        allAbilities={allAbilities}
      />
    </main>
  );
}
