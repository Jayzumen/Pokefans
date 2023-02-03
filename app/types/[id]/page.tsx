import { TypeData } from "@/types/typeTypes";
import DamageRelations from "./DamageRelations";

export async function getTypeData(id: number): Promise<TypeData> {
  const res = await fetch(`https://pokeapi.co/api/v2/type/${id}`);
  const data: TypeData = await res.json();
  return data;
}

export default async function TypePage({ params }: { params: { id: number } }) {
  const typeData = await getTypeData(params.id);
  return (
    <main className="p-4">
      <h1 className="my-2 text-4xl font-bold capitalize underline">
        {typeData.name}
      </h1>
      <DamageRelations typeData={typeData} />
      {/* TODO: Add moves and Pokemon of the Type */}
    </main>
  );
}
