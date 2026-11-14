import Link from "next/link";
import type { Team } from "@/lib/teams";
import { TeamMemberCard } from "./TeamDisplay";

export default function TeamsDisplay({ teams }: { teams: Team[] }) {
  return (
    <div className="flex flex-col gap-4 p-2">
      {teams.map((t) => (
        <section
          className="mx-auto w-full max-w-[1200px] rounded-lg bg-slate-700 p-4"
          key={t.uid}
        >
          <h2 className="text-xl font-semibold text-white">
            <Link href={`/teams/${t.username}`} className="hover:underline">
              {t.username}&apos;s Team
            </Link>
          </h2>
          <div className="mx-auto flex max-w-[1000px] flex-wrap justify-center gap-8 px-2 py-4">
            {[...t.members]
              .sort((a, b) => a.id - b.id)
              .map((mon) => (
                <TeamMemberCard key={mon.id} mon={mon} size={250} />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
