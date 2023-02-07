import React from "react";
import Link from "next/link";
import { PokemonTypes } from "@/assets/constants";
import { MoveData } from "@/types/moveTypes";
import Image from "next/image";

function MoveInfo({ move }: { move: MoveData }) {
  const englishFlavText = move.flavor_text_entries.find(
    (entry) => entry.language.name === "en"
  );

  const englishEffect = move.effect_entries.find(
    (entry) => entry.language.name === "en"
  );
  return (
    <div className="rounded-lg bg-slate-700 p-2 lg:mx-auto lg:w-[70%]">
      <h1 className="my-2 text-4xl font-bold capitalize underline">
        {move.name}
      </h1>

      <div className="my-4 flex flex-col items-center justify-center gap-8 md:flex-row md:gap-32">
        <div className="py-2">
          <p className="text-2xl font-bold">Effect:</p>
          <p className="mx-auto max-w-[600px] text-xl">
            {englishEffect?.effect
              ? englishEffect?.effect.replace(
                  "$effect_chance",
                  `${move.effect_chance}`
                )
              : englishFlavText?.flavor_text
              ? englishFlavText?.flavor_text
              : "No effect yet"}
          </p>
        </div>
        <div className="flex flex-col gap-2 md:w-[50%]">
          <div className="flex flex-row items-center justify-center gap-4 text-center text-2xl font-bold">
            <p>Type:</p>
            <Link
              href={`/types/${move.type.name}`}
              style={{
                backgroundColor: PokemonTypes.filter(
                  (typ) => typ.name === move.type.name
                )[0].color,
              }}
              className="rounded-full p-2 shadow-md shadow-black transition hover:opacity-80"
            >
              <Image
                height={30}
                width={30}
                src={`/typeImages/${move.type.name}.svg`}
                alt={move.type.name}
              />
            </Link>
          </div>
          <p className="text-xl font-semibold">
            Accuracy: {move.accuracy ? move.accuracy : "0"}
          </p>
          <p className="text-xl font-semibold">
            Power: {move.power ? move.power : "0"}
          </p>
          <p className="text-xl font-semibold">PP: {move.pp}</p>
        </div>
      </div>
    </div>
  );
}

export default MoveInfo;
