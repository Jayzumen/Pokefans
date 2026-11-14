import Link from "next/link";
import { describe } from "@/lib/entries";
import { titleCase, typeVars } from "@/lib/types";
import type { MoveData } from "@/types/moveTypes";
import { TypeChip } from "../TypeChip";

export function MoveStats({ move }: { move: MoveData }) {
  const items = [
    { label: "Power", value: move.power ?? "—" },
    { label: "Accuracy", value: move.accuracy ? `${move.accuracy}%` : "—" },
    { label: "PP", value: move.pp ?? "—" },
  ];
  return (
    <dl className="grid grid-cols-3 gap-2">
      {items.map((i) => (
        <div key={i.label} className="rounded-lg bg-muted/70 px-3 py-2">
          <dt className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            {i.label}
          </dt>
          <dd className="font-mono text-base font-medium tabular-nums">{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function MoveCard({ move }: { move: MoveData }) {
  return (
    <Link
      href={`/moves/${move.name}`}
      style={typeVars([move.type.name])}
      className="surface lift group flex flex-col gap-4 p-5 outline-none hover:border-[color-mix(in_oklch,var(--t)_40%,var(--border))] focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold tracking-[-0.01em]">
            {titleCase(move.name)}
          </h3>
          <p className="text-sm text-muted-foreground">
            <span className="capitalize">{move.damage_class?.name ?? "—"}</span>{" "}
            move
          </p>
        </div>
        <TypeChip type={move.type.name} link={false} />
      </div>
      <p className="line-clamp-3 flex-1 text-sm text-muted-foreground">
        {describe(move)}
      </p>
      <MoveStats move={move} />
    </Link>
  );
}
