import { PokemonTypes } from "@/assets/constants";
import MoveInfo from "@/components/movesPage/MoveInfo";
import MovePokemon from "@/components/movesPage/MovePokemon";
import { pokeapi, slugOrNotFound } from "@/lib/pokeapi";
import { resolveRefs } from "@/lib/pokemon-index";
import { MoveData } from "@/types/moveTypes";

// Pages are rendered on first request and then cached (ISR).
export async function generateStaticParams() {
  return [];
}

export default async function MovePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const move = await pokeapi<MoveData>(`move/${slugOrNotFound(id)}`);
  const pokemon = resolveRefs(move.learned_by_pokemon ?? []);

  const matchingType = PokemonTypes.find(
    (pokemonType) => pokemonType.name === move.type.name,
  );

  return (
    <main
      style={{ backgroundColor: matchingType?.color }}
      className="min-h-screen px-4 py-12 text-neutral-950"
    >
      <MoveInfo move={move} />
      <MovePokemon pokemon={pokemon} />
    </main>
  );
}
