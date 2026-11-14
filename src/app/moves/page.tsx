import SearchForm from "@/components/movesPage/SearchForm";
import { Move, MoveData } from "@/types/moveTypes";
import { pokeapi, randomIds } from "@/lib/pokeapi";

// Re-pick the random moves once per hour.
export const revalidate = 3600;
const MAX_MOVE_ID = 900;

async function randomMoves() {
  return Promise.all(
    randomIds(6, MAX_MOVE_ID).map((id) => pokeapi<MoveData>(`move/${id}`)),
  );
}

async function getAllMoves() {
  const data = await pokeapi<{ results: Move[] }>(`move?limit=${MAX_MOVE_ID}`);
  return data.results;
}

export default async function MovePage() {
  const [randomMoveData, allMoves] = await Promise.all([
    randomMoves(),
    getAllMoves(),
  ]);
  return (
    <main className="min-h-screen px-4 py-12">
      <h1 className="my-2 text-4xl font-bold capitalize underline">Move-Dex</h1>
      <SearchForm randomMoveData={randomMoveData} allMoves={allMoves} />
    </main>
  );
}
