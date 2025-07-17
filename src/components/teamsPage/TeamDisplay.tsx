import Image from "next/image";
import Link from "next/link";
import { DocumentData } from "firebase/firestore";
import { PokemonTypes } from "@/assets/constants";
import { Stat } from "@/types/pokemonTypes";
import { Type2 } from "@/types/typeTypes";

function TeamDisplay({ teamData }: { teamData: DocumentData | undefined }) {
  return (
    <>
      {teamData && teamData.length > 0 && (
        <div className="mx-auto flex max-w-[1200px] flex-wrap justify-center gap-8 py-10 px-2 text-black">
          {teamData
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
    </>
  );
}

export default TeamDisplay;
