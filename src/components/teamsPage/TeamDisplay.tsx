import Image from "next/image";
import Link from "next/link";
import { PokemonTypes } from "@/assets/constants";
import { artworkUrl } from "@/lib/pokemon";
import type { TeamMember } from "@/lib/teams";

const colorOf = (type: string | undefined) =>
  PokemonTypes.find((t) => t.name === type)?.color ?? "#737373";

export function TeamMemberCard({
  mon,
  size = 300,
}: {
  mon: TeamMember;
  size?: number;
}) {
  return (
    <div
      style={{
        background: `linear-gradient(180deg, ${colorOf(mon.types[0])} 0%, ${
          mon.types[1] ? colorOf(mon.types[1]) : "white"
        } 100%)`,
      }}
      className="rounded-lg p-2 text-neutral-950 capitalize shadow-md"
    >
      <p className="mx-auto w-fit text-2xl">{mon.name}</p>
      <Link href={`/pokemon/${mon.name}`}>
        <Image
          height={size}
          width={size}
          src={artworkUrl(mon.id)}
          alt={`${mon.name} official artwork`}
        />
      </Link>
      <p>
        Total Stats: <span className="font-semibold">{mon.bst}</span>
      </p>
      <div className="m-2 flex justify-center gap-2">
        {mon.types.map((type) => (
          <Link
            key={type}
            style={{ backgroundColor: colorOf(type) }}
            className="rounded-full p-2 shadow-md shadow-black transition hover:opacity-80"
            href={`/types/${type}`}
            title={type}
          >
            <Image
              width={30}
              height={30}
              src={`/typeImages/${type}.svg`}
              alt={type}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function TeamDisplay({ members }: { members: TeamMember[] }) {
  return (
    <div className="mx-auto flex max-w-[1200px] flex-wrap justify-center gap-8 px-2 py-10">
      {[...members]
        .sort((a, b) => a.id - b.id)
        .map((mon) => (
          <TeamMemberCard key={mon.id} mon={mon} />
        ))}
    </div>
  );
}
