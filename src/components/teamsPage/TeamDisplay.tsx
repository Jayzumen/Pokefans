import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { artworkUrl, formatDexNumber } from "@/lib/pokemon";
import { MAX_TEAM_SIZE, type Team, type TeamMember } from "@/lib/teams";
import { typeVars } from "@/lib/types";
import { TypeChips } from "../TypeChip";

function MemberTile({ mon }: { mon: TeamMember }) {
  return (
    <Link
      href={`/pokemon/${mon.name}`}
      style={typeVars(mon.types)}
      className="surface lift group flex flex-col p-1.5 outline-none hover:border-[color-mix(in_oklch,var(--t)_40%,var(--border))] focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <div className="type-surface relative grid aspect-square place-items-center rounded-[calc(var(--radius)-6px)]">
        <span className="absolute top-2 left-2.5 font-mono text-[11px] text-muted-foreground tabular-nums">
          {formatDexNumber(mon.id)}
        </span>
        <Image
          src={artworkUrl(mon.id)}
          alt={`${mon.name} official artwork`}
          width={160}
          height={160}
          className="size-[78%] object-contain transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
        />
      </div>
      <div className="space-y-1.5 px-1.5 pt-2 pb-1">
        <p className="truncate text-sm font-semibold capitalize">
          {mon.name.replace(/-/g, " ")}
        </p>
        <TypeChips types={mon.types} link={false} />
      </div>
    </Link>
  );
}

function EmptySlot() {
  return (
    <div className="grid aspect-[3/4] place-items-center rounded-[var(--radius)] border-2 border-dashed text-muted-foreground/50">
      <Plus aria-hidden className="size-6" />
      <span className="sr-only">Empty slot</span>
    </div>
  );
}

/** A trainer's team: six slots, empty ones dashed, with the combined BST. */
export default function TeamCard({
  team,
  showHeader = true,
}: {
  team: Team;
  showHeader?: boolean;
}) {
  const members = [...team.members].sort((a, b) => a.id - b.id);
  const totalBst = members.reduce((s, m) => s + (m.bst || 0), 0);

  return (
    <section className="surface p-4 md:p-6" aria-label={`${team.username}'s team`}>
      {showHeader && (
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold">
            <Link
              href={`/teams/${team.username}`}
              className="underline-offset-4 hover:underline"
            >
              {team.username}
            </Link>
          </h2>
          <p className="font-mono text-xs text-muted-foreground tabular-nums">
            {members.length}/{MAX_TEAM_SIZE} · BST {totalBst}
          </p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {members.map((m) => (
          <MemberTile key={m.id} mon={m} />
        ))}
        {Array.from({ length: Math.max(0, MAX_TEAM_SIZE - members.length) }, (_, i) => (
          <EmptySlot key={`empty-${i}`} />
        ))}
      </div>
    </section>
  );
}
