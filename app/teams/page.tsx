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
    <main className="px-4 pt-32 pb-4">
      <h1 className="text-4xl font-semibold underline">Teams</h1>
      <div className="flex flex-col gap-4 p-2 text-black">
        {teams &&
          teams.map((t, index) => (
            <div
              className="mx-auto max-w-[1200px] rounded-lg bg-slate-700"
              key={index}
            >
              <p className="text-xl font-semibold text-white underline">
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
                      const matchingTypes = p.types.map((type: Type) => {
                        return PokemonTypes.filter(
                          (pokemonType) => pokemonType.name === type.type.name
                        )[0];
                      });
                      return (
                        <div
                          style={{
                            background: `linear-gradient(180deg, ${
                              matchingTypes[0].color
                            } 0%, ${
                              matchingTypes[1]
                                ? matchingTypes[1]?.color
                                : "white"
                            } 100%)`,
                          }}
                          className="rounded-lg capitalize shadow-md shadow-black"
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
                          <div className="flex justify-center p-2">
                            {p.types.map((t: Type) => {
                              const matchingType = PokemonTypes.filter(
                                (typ) => typ.name === t.type.name
                              )[0];
                              return (
                                <Link
                                  key={t.slot}
                                  href={`/types/${t.type.name}`}
                                  style={{
                                    backgroundColor: matchingType.color,
                                  }}
                                  className="mx-auto rounded-full p-2 text-xl font-semibold text-black shadow-md shadow-black transition hover:opacity-80"
                                >
                                  <Image
                                    src={`/typeImages/${t.type.name}.svg`}
                                    alt={t.type.name}
                                    width={30}
                                    height={30}
                                  />
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
