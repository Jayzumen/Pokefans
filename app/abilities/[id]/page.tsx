import { AbilityData } from "../../../types/abilityTypes";
import AbilityInfo from "./AbilityInfo";
import AbilityPokemon from "./AbilityPokemon";

async function getAbilityData(id: string): Promise<AbilityData> {
  const abilityRes = await fetch(`https://pokeapi.co/api/v2/ability/${id}`);
  const abilityData: AbilityData = await abilityRes?.json();
  return abilityData;
}

export default async function Ability({ params }: { params: { id: string } }) {
  const ability = await getAbilityData(params.id);

  if (ability) {
    return (
      <main className="mx-4">
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
