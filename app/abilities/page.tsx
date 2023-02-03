import Link from "next/link";
import { AbilityData } from "./../../types/abilityTypes";

async function randomAbilities(): Promise<AbilityData[]> {
  const abilities: AbilityData[] = [];
  for (let i = 1; i <= 10; i++) {
    const randomId = Math.floor(Math.random() * 298);
    const res = await fetch(`https://pokeapi.co/api/v2/ability/${randomId}`);
    const data: AbilityData = await res.json();
    abilities.push(data);
  }
  return abilities;
}

export default async function AbilityPage() {
  const randomAbilityData: AbilityData[] = await randomAbilities();
  // const searchedAbilityData: AbilityData[] = await getSearchedAbilities(abilityName);

  return (
    <main className="p-4">
      <div className="mx-auto mt-4 flex max-w-[1400px] flex-wrap justify-center gap-4 text-white">
        {randomAbilityData?.map((ability) => {
          const englishEntry = ability.flavor_text_entries?.find(
            (entry: any) => entry.language.name === "en"
          );

          return (
            <Link
              key={ability.id}
              href={`/abilities/${ability.id}`}
              className="flex min-h-[250px] min-w-[250px] flex-col gap-2 rounded-lg bg-slate-700"
            >
              <p className="border-b-2 py-1 text-2xl font-bold capitalize">
                {ability?.name}
              </p>
              <p className="mx-auto max-w-[200px] text-xl font-semibold">
                {englishEntry?.flavor_text}
              </p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
