import { Move, MoveData } from "@/types/moveTypes";
import SearchForm from "./components/SearchForm";

async function randomMoves(): Promise<MoveData[]> {
  const moves: MoveData[] = [];
  for (let i = 1; i <= 6; i++) {
    const randomId = Math.floor(Math.random() * 900);
    const res = await fetch(`https://pokeapi.co/api/v2/move/${randomId}`);
    const data: MoveData = await res?.json();
    moves.push(data);
  }
  return moves;
}

async function getAllMoves() {
  const res = await fetch("https://pokeapi.co/api/v2/move?limit=900");
  const data = await res.json();
  const results: Move[] = await data.results;
  return results;
}

export default async function MovePage() {
  const randomMoveData: MoveData[] = await randomMoves();
  const allMoves = await getAllMoves();
  return (
    <main className="min-h-screen px-4 pt-32  pb-4">
      <h1 className="my-2 text-4xl font-bold capitalize underline">Move-Dex</h1>
      <SearchForm randomMoveData={randomMoveData} allMoves={allMoves} />
    </main>
  );
}
