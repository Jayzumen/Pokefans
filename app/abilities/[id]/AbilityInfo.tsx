import { AbilityData } from "@/types/abilityTypes";
import React from "react";

function AbilityInfo({ ability }: { ability: AbilityData }) {
  const englishFlavText = ability.flavor_text_entries.find(
    (entry) => entry.language.name === "en"
  );

  const englishEffect = ability.effect_entries.find(
    (entry) => entry.language.name === "en"
  );
  return (
    <div>
      <h1 className="my-2 text-4xl font-bold capitalize underline">
        {ability.name}
      </h1>

      <div className="py-2">
        <p className="text-2xl font-bold">Effect:</p>
        <p className="mx-auto max-w-[700px] text-xl">
          {englishEffect?.effect
            ? englishEffect?.effect
            : englishFlavText?.flavor_text
            ? englishFlavText?.flavor_text
            : "No Effect text yet"}
        </p>
      </div>
    </div>
  );
}

export default AbilityInfo;
