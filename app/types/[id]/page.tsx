import { PokemonTypes } from "@/assets/constants";
import { TypeData } from "@/types/typeTypes";
import DamageRelations from "./DamageRelations";
import TypePokemon from "./TypePokemon";

async function getTypeData(id: string): Promise<TypeData> {
  const res = await fetch(`https://pokeapi.co/api/v2/type/${id}`);
  const data: TypeData = await res?.json();
  return data;
}

export default async function TypePage({ params }: { params: { id: string } }) {
  const typeData = await getTypeData(params.id);

  const matchingType = PokemonTypes.filter(
    (pokemonType) => pokemonType.name === typeData.name
  )[0];
  return (
    <main
      style={{ backgroundColor: matchingType?.color }}
      className="px-4 pt-32 pb-4"
    >
      <h1 className="my-2 text-4xl font-bold capitalize underline">
        {typeData.name}
      </h1>
      <DamageRelations typeData={typeData} />
      <TypePokemon typeData={typeData} />
    </main>
  );
}
