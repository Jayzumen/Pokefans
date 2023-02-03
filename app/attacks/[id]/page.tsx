import Link from "next/link";
import Image from "next/image";
import { AttackData } from "../../../types/attackTypes";
import { PokemonTypes } from "@/assets/constants";

export async function getAttackData(id: number) {
  const attackRes = await fetch(`https://pokeapi.co/api/v2/move/${id}`);
  const attackData: AttackData = await attackRes.json();
  return attackData;
}

export default async function AttackPage({
  params,
}: {
  params: { id: number };
}) {
  const attack = await getAttackData(params.id);

  const englishFlavText = attack.flavor_text_entries.find(
    (entry) => entry.language.name === "en"
  );

  const englishEffect = attack.effect_entries.find(
    (entry) => entry.language.name === "en"
  );
  return (
    <main className="mx-4">
      <h1 className="my-2 text-4xl font-bold capitalize underline">
        {attack.name}
      </h1>

      <div className="my-4 flex flex-col items-center justify-center gap-8 md:flex-row md:gap-32">
        <div className="py-2">
          <p className="text-2xl font-bold">Effect:</p>
          <p className="mx-auto max-w-[400px] text-xl">
            {englishEffect?.effect
              ? englishEffect?.effect.replace(
                  "$effect_chance",
                  `${attack.effect_chance}`
                )
              : englishFlavText?.flavor_text}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-bold">
            Type:{" "}
            <Link
              href={`/types/${attack.type.url.split("/")[6]}`}
              className={`rounded-md py-2 px-4 text-center text-lg font-semibold capitalize text-black transition hover:opacity-80 ${
                PokemonTypes.filter((typ) => typ.name === attack.type.name)[0]
                  .color
              }`}
            >
              {attack.type.name}
            </Link>
          </p>
          <p className="text-xl font-semibold">Accuracy: {attack.accuracy}</p>
          <p className="text-xl font-semibold">Power: {attack.power}</p>
          <p className="text-xl font-semibold">PP: {attack.pp}</p>
        </div>
      </div>

      <div>
        <p className="py-4 text-2xl font-bold">Pokemon with the ability:</p>
        <div className="flex flex-wrap gap-8 p-4">
          {attack.learned_by_pokemon.map((pokemon) => (
            <Link
              key={pokemon.name}
              href={`/pokemon/${pokemon.url.split("/")[6]}`}
              className="mx-auto flex min-w-[250px] flex-col items-center justify-center rounded-lg bg-slate-600 py-2 text-xl font-semibold transition hover:bg-slate-700"
            >
              <p className="mx-auto max-w-[200px] capitalize">{pokemon.name}</p>
              <Image
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
                  pokemon.url.split("/")[6]
                }.png`}
                alt={pokemon.url.split("/")[6]}
                width={200}
                height={200}
              />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
