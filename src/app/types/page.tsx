import { PokemonTypes } from "@/assets/constants";
import { Type } from "@/types/typeTypes";
import Image from "next/image";
import Link from "next/link";
import { pokeapi } from "@/lib/pokeapi";

async function getTypeData(): Promise<Type[]> {
  const data = await pokeapi<{ results: Type[] }>("type?limit=18");
  return data.results;
}

export default async function TypesPage() {
  const typeData = await getTypeData();
  return (
    <main className="min-h-screen px-4 py-12">
      <h1 className="my-2 text-4xl font-bold capitalize underline">Type-Dex</h1>
      <div className="mx-auto mt-16 flex max-w-[800px] flex-wrap justify-center gap-8">
        {typeData.map((type) => {
          const matchingType = PokemonTypes.filter(
            (t) => t.name === type.name
          )[0];
          return (
            <Link key={type.name} href={`/types/${type.name}`}>
              <p className="text-xl font-semibold capitalize">{type.name}</p>
              <Image
                style={{ backgroundColor: matchingType?.color }}
                className="rounded-full p-2 shadow-md shadow-black transition hover:opacity-80"
                src={`/typeImages/${type.name}.svg`}
                alt={type.name}
                height={100}
                width={100}
              />
            </Link>
          );
        })}
      </div>
    </main>
  );
}
