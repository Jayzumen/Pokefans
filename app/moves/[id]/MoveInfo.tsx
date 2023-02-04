import React from "react";
import Link from "next/link";
import { PokemonTypes } from "@/assets/constants";
import { MoveData } from "@/types/moveTypes";

function MoveInfo({ move }: { move: MoveData }) {
  const englishFlavText = move.flavor_text_entries.find(
    (entry) => entry.language.name === "en"
  );

  const englishEffect = move.effect_entries.find(
    (entry) => entry.language.name === "en"
  );
  return (
    <>
      <h1 className="my-2 text-4xl font-bold capitalize underline">
        {move.name}
      </h1>

      <div className="my-4 flex flex-col items-center justify-center gap-8 md:flex-row md:gap-32">
        <div className="py-2">
          <p className="text-2xl font-bold">Effect:</p>
          <p className="mx-auto max-w-[400px] text-xl">
            {englishEffect?.effect
              ? englishEffect?.effect.replace(
                  "$effect_chance",
                  `${move.effect_chance}`
                )
              : englishFlavText?.flavor_text}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-bold">
            Type:{" "}
            <Link
              href={`/types/${move.type.name}`}
              className={`rounded-md py-2 px-4 text-center text-lg font-semibold capitalize text-black transition hover:opacity-80 ${
                PokemonTypes.filter((typ) => typ.name === move.type.name)[0]
                  .color
              }`}
            >
              {move.type.name}
            </Link>
          </p>
          <p className="text-xl font-semibold">Accuracy: {move.accuracy}</p>
          <p className="text-xl font-semibold">Power: {move.power}</p>
          <p className="text-xl font-semibold">PP: {move.pp}</p>
        </div>
      </div>
    </>
  );
}

export default MoveInfo;
