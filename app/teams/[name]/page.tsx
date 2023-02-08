import { PokemonTypes } from "@/assets/constants";
import Image from "next/image";
import Link from "next/link";
import { collection, DocumentData, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Stat } from "@/types/pokemonTypes";
import { Type2 } from "@/types/typeTypes";

const getPokemonTeam = async (name: string) => {
  if (name) {
    const q = collection(db, "Teams", name, "pokemonTeam");
    const querySnapshot = await getDocs(q);
    const data: DocumentData = [];
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    return data;
  }
};

interface TeamPageProps {
  name: string;
}

export async function generateStaticParams() {
  const q = collection(db, "Teams");
  const querySnapshot = await getDocs(q);
  const params: TeamPageProps[] = [];
  querySnapshot.forEach((doc) => {
    params.push({ name: doc.id });
  });
  return params;
}

export default async function TeamPage({
  params,
}: {
  params: { name: string };
}) {
  const savedTeamData = await getPokemonTeam(params.name);

  return (
    <div className="mx-4 mt-28 mb-4 min-h-screen">
      <h1 className="text-5xl font-semibold underline">My Team</h1>
      {savedTeamData && savedTeamData.length > 0 && (
        <div className="mx-auto flex max-w-[1200px] flex-wrap justify-center gap-8 py-10 px-2 text-black">
          {savedTeamData
            .sort((a: DocumentData, b: DocumentData) => a.id - b.id)
            .map((mon: DocumentData) => {
              let totalStats = mon.stats.reduce(
                (tot: number, arr: Stat) => tot + arr.base_stat,
                0
              );
              const matchingTypes = mon.types.map((type: Type2) => {
                return PokemonTypes.filter(
                  (pokemonType) => pokemonType.name === type.type.name
                )[0];
              });
              return (
                <div
                  key={mon.id}
                  style={{
                    background: `linear-gradient(180deg, ${
                      matchingTypes[0].color
                    } 0%, ${
                      matchingTypes[1] ? matchingTypes[1]?.color : "white"
                    } 100%)`,
                  }}
                  className="rounded-lg p-2 capitalize"
                >
                  <p className="mx-auto w-fit text-2xl">{mon.name}</p>
                  <Link href={`/pokemon/${mon.name}`}>
                    <Image
                      height={300}
                      width={300}
                      src={mon.sprite}
                      alt={mon.name}
                    />
                  </Link>
                  <div>
                    <p>
                      Total Stats:
                      <span className="font-semibold"> {totalStats}</span>
                    </p>
                  </div>
                  <div className="m-2 flex gap-2">
                    {mon.types.map((t: Type2) => {
                      const matchingType = PokemonTypes.filter(
                        (typ) => typ.name === t.type.name
                      )[0];
                      return (
                        <Link
                          key={t.slot}
                          style={{ backgroundColor: matchingType.color }}
                          className="mx-auto rounded-full p-2 shadow-md shadow-black transition hover:shadow-white"
                          href={`/types/${t.type.name}`}
                        >
                          <Image
                            width={30}
                            height={30}
                            src={`/typeImages/${t.type.name}.svg`}
                            alt={t.type.name}
                          />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
