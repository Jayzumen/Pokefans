import { PokemonTypes } from "@/assets/constants";
import { MoveData } from "@/types/moveTypes";
import Image from "next/image";
import Link from "next/link";

export default function SearchedMoves({
  searchedMoves,
}: {
  searchedMoves: MoveData[];
}) {
  return (
    <div className="mx-auto mt-4 flex max-w-[1400px] flex-wrap justify-center gap-4">
      {searchedMoves?.map((move, index) => {
        const englishEntry = move.flavor_text_entries?.find(
          (entry: any) => entry.language.name === "en"
        );
        const matchingType = PokemonTypes.filter(
          (pokemonType) => pokemonType.name === move.type.name
        )[0];

        return (
          <div
            key={index}
            style={{
              backgroundColor: matchingType.color,
            }}
            className="flex min-h-[250px] min-w-[280px] flex-col gap-2 rounded-lg text-black md:min-w-[350px]"
          >
            <Link href={`/moves/${move?.name}`}>
              <div className="mx-auto min-h-[80px] max-w-[300px] py-1 capitalize">
                <p className="mx-auto w-fit text-2xl font-bold transition hover:underline">
                  {move?.name}
                </p>
              </div>
            </Link>
            <p className="mx-auto min-h-[200px] max-w-[300px] text-xl font-semibold">
              {englishEntry?.flavor_text
                ? englishEntry?.flavor_text
                : "No Description yet"}
            </p>
            <Link
              href={`/types/${move.type.name}`}
              style={{ backgroundColor: matchingType.color }}
              title={move.type.name}
              className="mx-auto mb-2 w-fit rounded-full border border-black p-2 shadow-md shadow-black duration-300 hover:scale-105"
            >
              <Image
                height={30}
                width={30}
                src={`/typeImages/${move.type.name}.svg`}
                alt={move.type.name}
              />
            </Link>
          </div>
        );
      })}
    </div>
  );
}
