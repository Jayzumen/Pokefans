import Link from "next/link";
import Image from "next/image";
import { MoveData } from "../../../types/moveTypes";
import { PokemonTypes } from "@/assets/constants";

async function getMoveData(id: string) {
  const moveRes = await fetch(`https://pokeapi.co/api/v2/move/${id}`);
  const moveData: MoveData = await moveRes?.json();
  return moveData;
}

export default async function movePage({ params }: { params: { id: string } }) {
  const move = await getMoveData(params?.id);

  const englishFlavText = move.flavor_text_entries.find(
    (entry) => entry.language.name === "en"
  );

  const englishEffect = move.effect_entries.find(
    (entry) => entry.language.name === "en"
  );
  if (move) {
    return (
      <main className="mx-4">
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

        <div>
          <p className="py-4 text-2xl font-bold">
            Pokemon that can learn this move:
          </p>
          <div className="flex flex-wrap gap-8 p-4">
            {move.learned_by_pokemon.map((pokemon) => (
              <Link
                key={pokemon.name}
                href={`/pokemon/${pokemon.name}`}
                className="mx-auto flex min-w-[250px] flex-col items-center justify-center rounded-lg bg-slate-600 py-2 text-xl font-semibold transition hover:bg-slate-700"
              >
                <p className="mx-auto max-w-[200px] capitalize">
                  {pokemon.name}
                </p>
                <Image
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
                    pokemon.url.split("/")[6]
                  }.png`}
                  alt={pokemon.name}
                  width={200}
                  height={200}
                />
              </Link>
            ))}
          </div>
        </div>
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
