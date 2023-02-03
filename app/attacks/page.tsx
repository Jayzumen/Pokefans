import { AttackData } from "@/types/attackTypes";
import Link from "next/link";

async function randomAttacks(): Promise<AttackData[]> {
  const attacks: AttackData[] = [];
  for (let i = 1; i <= 10; i++) {
    const randomId = Math.floor(Math.random() * 900);
    const res = await fetch(`https://pokeapi.co/api/v2/move/${randomId}`);
    const data: AttackData = await res.json();
    attacks.push(data);
  }
  return attacks;
}

export default async function AttackPage() {
  const randomAttackData: AttackData[] = await randomAttacks();
  return (
    <main className="p-4">
      <h1 className="my-2 text-4xl font-bold capitalize underline">
        Attack-Dex
      </h1>
      <div className="mx-auto mt-4 flex max-w-[1400px] flex-wrap justify-center gap-4 text-white">
        {randomAttackData?.map((attack) => {
          const englishEntry = attack.flavor_text_entries?.find(
            (entry: any) => entry.language.name === "en"
          );

          return (
            <Link
              key={attack.id}
              href={`/attacks/${attack.id}`}
              className="flex min-h-[250px] min-w-[250px] flex-col gap-2 rounded-lg bg-slate-700"
            >
              <p className="border-b-2 py-1 text-2xl font-bold capitalize">
                {attack?.name}
              </p>
              <p className="mx-auto max-w-[200px] text-xl font-semibold">
                {englishEntry?.flavor_text}
              </p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
