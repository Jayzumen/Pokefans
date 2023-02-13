import { PokemonTypes } from "@/assets/constants";
import { TypeData } from "@/types/typeTypes";
import DamageRelations from "./components/DamageRelations";
import TypePokemon from "./components/TypePokemon";

async function getTypeData(id: string): Promise<TypeData> {
  const res = await fetch(`https://pokeapi.co/api/v2/type/${id}`);
  const data: TypeData = await res?.json();
  const pokemonData = await Promise.all(
    data.pokemon.map(async (pokemon) => {
      const res = await fetch(pokemon.pokemon.url);
      const data = await res?.json();
      return data;
    })
  );
  return { ...data, pokemonData };
}

export async function generateStaticParams() {
  const res = await fetch("https://pokeapi.co/api/v2/type?limit=1");
  const data = await res?.json();
  const params = data.results.map((type: { name: string; url: string }) => ({
    id: type.name,
  }));
  return params;
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
