import Link from "next/link";
import Image from "next/image";
import { AbilityData } from "../../../types/abilityTypes";

async function getAbilityData(id: string): Promise<AbilityData> {
  const abilityRes = await fetch(`https://pokeapi.co/api/v2/ability/${id}`);
  const abilityData: AbilityData = await abilityRes?.json();
  return abilityData;
}

export default async function Ability({ params }: { params: { id: string } }) {
  const ability = await getAbilityData(params.id);

  const englishFlavText = ability.flavor_text_entries.find(
    (entry) => entry.language.name === "en"
  );

  const englishEffect = ability.effect_entries.find(
    (entry) => entry.language.name === "en"
  );
  if (ability) {
    return (
      <main className="mx-4">
        <h1 className="my-2 text-4xl font-bold capitalize underline">
          {ability.name}
        </h1>

        <div className="py-2">
          <p className="text-2xl font-bold">Effect:</p>
          <p className="mx-auto max-w-[400px] text-xl">
            {englishEffect?.effect
              ? englishEffect?.effect
              : englishFlavText?.flavor_text}
          </p>
        </div>

        <div>
          <p className="py-4 text-2xl font-bold">Pokemon with the ability:</p>
          <div className="flex flex-wrap gap-8 p-4">
            {ability.pokemon.map((pokemon, index) => (
              <Link
                key={index}
                href={`/pokemon/${pokemon.pokemon.name}`}
                className="mx-auto flex min-w-[250px] flex-col items-center justify-center rounded-lg bg-slate-600 py-2 text-xl font-semibold transition hover:bg-slate-700"
              >
                <p className="mx-auto max-w-[200px] capitalize">
                  {pokemon.pokemon.name}
                </p>
                <Image
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
                    pokemon.pokemon.url.split("/")[6]
                  }.png`}
                  alt={pokemon.pokemon.name}
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
          Ability not found
        </h1>
      </main>
    );
  }
}
