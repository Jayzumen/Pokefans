import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles, Swords, Users } from "lucide-react";
import { artworkUrl } from "@/lib/pokemon";
import { ROMAN, TYPE_NAMES } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TypeChip } from "../TypeChip";

function Tile({
  href,
  title,
  description,
  className,
  children,
}: {
  href: string;
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "surface lift group relative flex flex-col overflow-hidden p-6 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold tracking-[-0.02em]">{title}</h3>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        <span className="grid size-9 shrink-0 place-items-center rounded-full border text-muted-foreground transition-colors duration-200 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
      {children && <div className="mt-6 flex-1">{children}</div>}
    </Link>
  );
}

export default function Bento({
  counts,
}: {
  counts: { pokemon: number; moves: number; abilities: number };
}) {
  return (
    <div className="grid gap-4 md:grid-cols-4 md:auto-rows-[minmax(12rem,auto)]">
      <Tile
        href="/pokedex"
        title="Pokédex"
        description={`Search all ${counts.pokemon.toLocaleString("en-US")} Pokémon instantly by name or number.`}
        className="md:col-span-2 md:row-span-2"
      >
        <div className="relative h-full min-h-56">
          {[
            { id: 1, cls: "left-0 bottom-0 w-[42%] -rotate-6" },
            { id: 7, cls: "right-0 bottom-0 w-[42%] rotate-6" },
            { id: 4, cls: "left-1/2 bottom-4 w-[50%] -translate-x-1/2 z-10" },
          ].map((p) => (
            <Image
              key={p.id}
              src={artworkUrl(p.id)}
              alt=""
              width={260}
              height={260}
              className={cn(
                "absolute aspect-square object-contain drop-shadow-xl transition-transform duration-500 ease-out group-hover:-translate-y-1 motion-reduce:transition-none",
                p.cls,
              )}
            />
          ))}
        </div>
      </Tile>

      <Tile
        href="/types"
        title="Types"
        description="18 types, their strengths and weaknesses."
        className="md:col-span-2"
      >
        <div className="flex flex-wrap gap-1.5">
          {TYPE_NAMES.map((t) => (
            <TypeChip key={t} type={t} link={false} />
          ))}
        </div>
      </Tile>

      <Tile
        href="/generations/1"
        title="Generations"
        description="From Kanto to Paldea."
      >
        <div className="grid grid-cols-5 gap-1 font-mono text-sm text-muted-foreground">
          {ROMAN.slice(1).map((r) => (
            <span
              key={r}
              className="grid h-8 place-items-center rounded-md bg-muted transition-colors group-hover:bg-accent"
            >
              {r}
            </span>
          ))}
        </div>
      </Tile>

      <Tile
        href="/moves"
        title="Moves"
        description={`${counts.moves.toLocaleString("en-US")} moves with power, accuracy and PP.`}
      >
        <Swords aria-hidden className="size-10 text-muted-foreground/60" />
      </Tile>

      <Tile
        href="/abilities"
        title="Abilities"
        description={`${counts.abilities.toLocaleString("en-US")} abilities and who can have them.`}
        className="md:col-span-2"
      >
        <Sparkles aria-hidden className="size-10 text-muted-foreground/60" />
      </Tile>

      <Tile
        href="/teams"
        title="Teams"
        description="Build your team of six and see what other trainers picked."
        className="md:col-span-2"
      >
        <Users aria-hidden className="size-10 text-muted-foreground/60" />
      </Tile>
    </div>
  );
}
