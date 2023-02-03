import { TypeData } from "@/types/typeTypes";
import { getTypeData } from "./page";

export default async function TypeHead({ params }: { params: { id: number } }) {
  const type: TypeData = await getTypeData(params.id);
  return (
    <>
      <title>{type.name[0].toUpperCase() + type.name.slice(1)}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta
        name="description"
        content={`Page for Pokémon ${
          type.name[0].toUpperCase() + type.name.slice(1)
        }`}
      />
      <link rel="icon" type="image/svg+xml" href="/pokeball.svg" />
    </>
  );
}
