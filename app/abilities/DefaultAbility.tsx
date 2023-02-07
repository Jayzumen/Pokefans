import Link from "next/link";
import { AbilityData } from "@/types/abilityTypes";

export default function DefaultAbility({
  randomAbilityData,
}: {
  randomAbilityData: AbilityData[];
}) {
  return (
    <div className="mx-auto mt-4 flex max-w-[1400px] flex-wrap justify-center gap-4 text-white">
      {randomAbilityData?.map((ability) => {
        const englishEntry = ability.flavor_text_entries?.find(
          (entry: any) => entry.language.name === "en"
        );

        return (
          <Link
            key={ability.id}
            href={`/abilities/${ability.name}`}
            className="flex min-h-[250px] min-w-[250px] flex-col gap-2 rounded-lg bg-slate-700"
          >
            <p className="border-b-2 py-1 text-2xl font-bold capitalize">
              {ability?.name}
            </p>
            <p className="mx-auto max-w-[200px] text-xl font-semibold">
              {englishEntry?.flavor_text
                ? englishEntry?.flavor_text
                : "No Effect text yet"}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
