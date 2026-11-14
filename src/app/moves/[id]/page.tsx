import { PokemonTypes } from "@/assets/constants";
import MoveInfo from "@/components/movesPage/MoveInfo";
import MovePokemon from "@/components/movesPage/MovePokemon";
import { mapLimit, pokeapi, slugOrNotFound } from "@/lib/pokeapi";
import { MoveData } from "@/types/moveTypes";
import { PokemonData } from "@/types/pokemonTypes";

async function getMoveData(id: string): Promise<MoveData> {
  const moveData = await pokeapi<MoveData>(`move/${id}`);
  const pokemon = await mapLimit(moveData.learned_by_pokemon ?? [], 12, (p) =>
    pokeapi<PokemonData>(p.url),
  );
  return { ...moveData, pokemon };
}

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
  const move = await getMoveData(slugOrNotFound(id));

  const matchingType = PokemonTypes.find(
    (pokemonType) => pokemonType.name === move.type.name,
  );

  return (
    <main
      style={{ backgroundColor: matchingType?.color }}
      className="min-h-screen px-4 py-12 text-neutral-950"
    >
      <MoveInfo move={move} />
      <MovePokemon move={move} />
    </main>
  );
}
