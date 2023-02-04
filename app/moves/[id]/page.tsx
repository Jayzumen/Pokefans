import { MoveData } from "../../../types/moveTypes";
import MoveInfo from "./MoveInfo";
import MovePokemon from "./MovePokemon";

async function getMoveData(id: string): Promise<MoveData> {
  const moveRes = await fetch(`https://pokeapi.co/api/v2/move/${id}`);
  const moveData = await moveRes?.json();
  return moveData;
}

export default async function movePage({ params }: { params: { id: string } }) {
  const move = await getMoveData(params?.id);

  if (move) {
    return (
      <main className="mx-4">
        <MoveInfo move={move} />

        <MovePokemon move={move} />
      </main>
    );
  } else {
    return (
      <main className="mx-4">
        <h1 className="my-2 text-4xl font-bold capitalize underline">
          Move not found
        </h1>
      </main>
    );
  }
}
