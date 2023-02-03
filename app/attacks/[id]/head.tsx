import { AttackData } from "@/types/attackTypes";
import { getAttackData } from "./page";

export default async function AttackHead({
  params,
}: {
  params: { id: number };
}) {
  const attack: AttackData = await getAttackData(params.id);
  return (
    <>
      <title>{attack.name[0].toUpperCase() + attack.name.slice(1)}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta
        name="description"
        content={`Page for Pokémon ${
          attack.name[0].toUpperCase() + attack.name.slice(1)
        }`}
      />
      <link rel="icon" type="image/svg+xml" href="/pokeball.svg" />
    </>
  );
}
