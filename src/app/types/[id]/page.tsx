import { PokemonTypes } from "@/assets/constants";
import DamageRelations from "@/components/typesPage/DamageRelations";
import TypePokemon from "@/components/typesPage/TypePokemon";
import { pokeapi, slugOrNotFound } from "@/lib/pokeapi";
import { resolveRefs } from "@/lib/pokemon-index";
import { TypeData } from "@/types/typeTypes";

export const dynamicParams = false;

export function generateStaticParams() {
  return PokemonTypes.map((t) => ({ id: t.name }));
}

export default async function TypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const typeData = await pokeapi<TypeData>(`type/${slugOrNotFound(id)}`);
  const pokemon = resolveRefs(typeData.pokemon.map((p) => p.pokemon));

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
      <TypePokemon pokemon={pokemon} />
    </main>
  );
}
