import { PokemonTypes } from "@/assets/constants";
import DamageRelations from "@/components/typesPage/DamageRelations";
import TypePokemon from "@/components/typesPage/TypePokemon";
import { mapLimit, pokeapi, slugOrNotFound } from "@/lib/pokeapi";
import { PokemonData } from "@/types/pokemonTypes";
import { TypeData } from "@/types/typeTypes";

async function getTypeData(id: string): Promise<TypeData> {
  const data = await pokeapi<TypeData>(`type/${id}`);
  const pokemonData = await mapLimit(data.pokemon, 12, (p) =>
    pokeapi<PokemonData>(p.pokemon.url),
  );
  return { ...data, pokemonData };
}

// Pages are rendered on first request and then cached (ISR).
export async function generateStaticParams() {
  return [];
}

export default async function TypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const typeData = await getTypeData(slugOrNotFound(id));

  const matchingType = PokemonTypes.find(
    (pokemonType) => pokemonType.name === typeData.name,
  );
  return (
    <main
      style={{ backgroundColor: matchingType?.color }}
      className="min-h-screen px-4 py-12 text-neutral-950"
    >
      <h1 className="my-2 text-4xl font-bold capitalize underline">
        {typeData.name}
      </h1>
      <DamageRelations typeData={typeData} />
      <TypePokemon typeData={typeData} />
    </main>
  );
}
