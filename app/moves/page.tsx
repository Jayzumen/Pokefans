import { PokemonTypes } from "@/assets/constants";
import { MoveData } from "@/types/moveTypes";
import Link from "next/link";

async function randomMoves(): Promise<MoveData[]> {
  const moves: MoveData[] = [];
  for (let i = 1; i <= 9; i++) {
    const randomId = Math.floor(Math.random() * 900);
    const res = await fetch(`https://pokeapi.co/api/v2/move/${randomId}`);
    const data: MoveData = await res?.json();
    moves.push(data);
  }
  return moves;
}

export default async function MovePage() {
  const randomMoveData: MoveData[] = await randomMoves();
  return (
    <main className="min-h-screen px-4 pt-32  pb-4">
      <h1 className="my-2 text-4xl font-bold capitalize underline">Move-Dex</h1>
      <div className="mx-auto mt-4 flex max-w-[1400px] flex-wrap justify-center gap-4">
        {randomMoveData?.map((move, index) => {
          const englishEntry = move.flavor_text_entries?.find(
            (entry: any) => entry.language.name === "en"
          );
          const matchingType = PokemonTypes.filter(
            (pokemonType) => pokemonType.name === move.type.name
          )[0];

          return (
            <Link
              key={index}
              href={`/moves/${move.name}`}
              style={{
                backgroundColor: matchingType.color,
              }}
              className="flex min-h-[250px] min-w-[350px] flex-col gap-2 rounded-lg text-black"
            >
              <p className="mx-auto min-h-[80px] max-w-[300px] py-1 text-2xl font-bold capitalize underline">
                {move?.name}
              </p>
              <p className="mx-auto max-w-[300px] text-xl font-semibold">
                {englishEntry?.flavor_text
                  ? englishEntry?.flavor_text
                  : "No Description"}
              </p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
