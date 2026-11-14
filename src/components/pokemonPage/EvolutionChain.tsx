import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { artworkUrl, formatDexNumber, idFromUrl } from "@/lib/pokemon";
import { getPokemonById } from "@/lib/pokemon-index";
import { typeVars } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { Chain } from "@/types/pokemonTypes";
import EvoCheck from "./EvoCheck";

/** Split the evolution tree into stages: [base], [stage 1], [stage 2]. */
function toStages(root: Chain) {
  const stages: Chain[][] = [];
  let level: Chain[] = [root];
  while (level.length) {
    stages.push(level);
    level = level.flatMap((n) => n.evolves_to);
  }
  return stages;
}

function flatten(root: Chain): Chain[] {
  return [root, ...root.evolves_to.flatMap(flatten)];
}

function Member({
  node,
  current,
  all,
  isBase,
}: {
  node: Chain;
  current: string;
  all: Chain[];
  isBase: boolean;
}) {
  const id = Number(idFromUrl(node.species.url));
  const types = getPokemonById(id)?.types ?? ["normal"];
  const isCurrent = node.species.name === current;

  return (
    <div className="flex items-center gap-2 md:gap-3">
      {!isBase && (
        <div className="flex w-20 flex-col items-center gap-1 text-center text-[11px] leading-tight text-muted-foreground md:w-24">
          <ArrowRight aria-hidden className="size-4" />
          <EvoCheck species={all} index={node.species.name} />
        </div>
      )}
      <Link
        href={`/pokemon/${node.species.name}`}
        aria-current={isCurrent ? "page" : undefined}
        style={typeVars(types)}
        className={cn(
          "surface lift group flex w-28 flex-col items-center p-2 text-center outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 md:w-32",
          isCurrent && "ring-2 ring-[color-mix(in_oklch,var(--t)_70%,transparent)]",
        )}
      >
        <span className="type-surface grid aspect-square w-full place-items-center rounded-[calc(var(--radius)-6px)]">
          <Image
            src={artworkUrl(id)}
            alt=""
            width={96}
            height={96}
            className="size-[80%] object-contain transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
          />
        </span>
        <span className="mt-2 font-mono text-[11px] text-muted-foreground tabular-nums">
          {formatDexNumber(id)}
        </span>
        <span className="text-sm font-medium capitalize">
          {node.species.name.replace(/-/g, " ")}
        </span>
      </Link>
    </div>
  );
}

export default function EvolutionChain({
  root,
  current,
}: {
  root: Chain;
  current: string;
}) {
  if (root.evolves_to.length === 0) return null;
  const stages = toStages(root);
  const all = flatten(root);

  return (
    <div className="flex flex-wrap items-center gap-y-4">
      {stages.map((stage, i) => (
        <div
          key={i}
          className={cn(
            "flex gap-3",
            // Branching stages (e.g. Eevee) wrap into a grid.
            stage.length > 2 ? "flex-wrap" : "flex-col",
          )}
        >
          {stage.map((node) => (
            <Member
              key={node.species.name}
              node={node}
              current={current}
              all={all}
              isBase={i === 0}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
