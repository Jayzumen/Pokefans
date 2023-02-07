import { AbilityData, Ability } from "./../../types/abilityTypes";
import SearchForm from "./SearchForm";

async function randomAbilities(): Promise<AbilityData[]> {
  const abilities: AbilityData[] = [];
  for (let i = 1; i <= 10; i++) {
    const randomId = Math.floor(Math.random() * 298);
    const res = await fetch(`https://pokeapi.co/api/v2/ability/${randomId}`);
    const data: AbilityData = await res?.json();
    abilities.push(data);
  }
  return abilities;
}

async function getAllAbilities() {
  const res = await fetch("https://pokeapi.co/api/v2/ability?limit=400");
  const data = await res?.json();
  const results: Ability[] = await data.results;
  return results;
}

export default async function AbilityPage() {
  const randomAbilityData: AbilityData[] = await randomAbilities();
  const allAbilities: Ability[] = await getAllAbilities();

  return (
    <main className="min-h-screen px-4 pt-32 pb-4">
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
