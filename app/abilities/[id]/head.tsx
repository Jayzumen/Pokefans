import { AbilityData } from "@/types/abilityTypes";
import { getAbilityData } from "./page";

export default async function AbilityHead({
  params,
}: {
  params: { id: number };
}) {
  const ability: AbilityData = await getAbilityData(params.id);
  return (
    <>
      <title>{ability.name[0].toUpperCase() + ability.name.slice(1)}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta
        name="description"
        content={`Page for the Ability ${
          ability.name[0].toUpperCase() + ability.name.slice(1)
        }`}
      />
      <link rel="icon" type="image/svg+xml" href="/pokeball.svg" />
    </>
  );
}
