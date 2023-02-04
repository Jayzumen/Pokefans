import Link from "next/link";
import Image from "next/image";
import { collection, DocumentData, getDocs } from "firebase/firestore";
import { db } from "./../firebase";
import { PokemonTypes } from "@/assets/constants";
import { Stat, Type } from "@/types/pokemonTypes";

async function getTeams() {
  const teamsRef = collection(db, "Teams");
  const querySnapshot = await getDocs(teamsRef);
  const data: DocumentData[] = [];
  const teamData: DocumentData[] = [];
  querySnapshot.forEach(async (doc) => {
    const pokemonTeamRef = collection(db, "Teams", doc.id, "pokemonTeam");
    teamData.push(
      getDocs(pokemonTeamRef).then((pokemonTeamSnapshot) => {
        const pokemonTeamData: DocumentData = [];
        pokemonTeamSnapshot.forEach((pokemonDoc) => {
          pokemonTeamData.push(pokemonDoc.data());
        });
        data.push({
          userId: doc.id,
          pokemonTeam: pokemonTeamData,
        });
      })
    );
  });
  await Promise.all(teamData);
  return data;
}

export default async function TeamsPage() {
  const teams = await getTeams();
  return (
    <main className="p-4">
      <h1 className="text-4xl font-semibold underline">Teams</h1>
      <div className="flex flex-col gap-4 p-2">
        {teams &&
          teams.map((t, index) => (
            <div
              className="mx-auto max-w-[1200px] rounded-lg bg-slate-800"
              key={index}
            >
              <p className="text-xl font-semibold underline">
                {t.userId}'s Team
              </p>
              <div className="mx-auto flex max-w-[1000px] flex-wrap justify-center gap-8 py-4 px-2 ">
                {t.pokemonTeam.length > 0 &&
                  t.pokemonTeam
                    .sort((a: DocumentData, b: DocumentData) => a.id - b.id)
                    .map((p: DocumentData) => {
                      let totalStats = p.stats.reduce(
                        (tot: number, arr: Stat) => tot + arr.base_stat,
                        0
                      );
                      return (
                        <div
                          className="rounded-lg bg-slate-700 capitalize shadow-lg shadow-slate-600"
                          key={p.id}
                        >
                          <p className="mx-auto w-fit text-2xl">{p.name}</p>
                          <Link href={`/pokemon/${p.name}`}>
                            <Image
                              height={250}
                              width={250}
                              src={p.sprite}
                              alt={p.name}
                            />
                          </Link>
                          <div>
                            <p>
                              Total Stats:{" "}
                              <span className="font-semibold">
                                {totalStats}
                              </span>
                            </p>
                          </div>
                          <div className="flex p-2">
                            {p.types.map((t: Type) => {
                              const matchingType = PokemonTypes.filter(
                                (typ) => typ.name === t.type.name
                              )[0];
                              return (
                                <Link
                                  key={t.slot}
                                  href={`/types/${t.type.name}`}
                                  className={`mx-auto min-w-[100px] rounded-md p-2 text-xl font-semibold text-black ${matchingType.color} transition hover:opacity-80`}
                                >
                                  {t.type.name}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}
