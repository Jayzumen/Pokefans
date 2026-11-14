import Image from "next/image";
import Link from "next/link";
import { artworkUrl, formatDexNumber } from "@/lib/pokemon";
import type { IndexPokemon } from "@/lib/pokemon-index";
import { typeVars } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TypeChips } from "./TypeChip";

/** Minimal shape a card needs: works with index entries and team members. */
export type CardPokemon = Pick<IndexPokemon, "id" | "name" | "types">;

/**
 * Pokémon card (§4.8): the whole card is one link; artwork sits on a soft
 * type surface; dex number in mono.
 */
export default function PokemonCard({
  pokemon,
  priority = false,
  className,
}: {
  pokemon: CardPokemon;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={`/pokemon/${pokemon.name}`}
      style={typeVars(pokemon.types)}
      className={cn(
        "surface lift group relative flex flex-col overflow-hidden p-2 outline-none",
        "hover:border-[color-mix(in_oklch,var(--t)_40%,var(--border))] focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className,
      )}
    >
      <div className="type-surface relative grid aspect-square place-items-center overflow-hidden rounded-[calc(var(--radius)-6px)]">
        <span className="absolute top-2.5 left-3 font-mono text-xs text-muted-foreground tabular-nums">
          {formatDexNumber(pokemon.id)}
        </span>
        <Image
          src={artworkUrl(pokemon.id)}
          alt={`${pokemon.name} official artwork`}
          width={240}
          height={240}
          sizes="(min-width: 1280px) 240px, (min-width: 640px) 30vw, 45vw"
          priority={priority}
          className="h-[78%] w-auto object-contain drop-shadow-[0_8px_12px_oklch(0_0_0/0.15)] transition-transform duration-300 ease-out group-hover:scale-[1.06] motion-reduce:transition-none"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 px-2 pt-3 pb-2">
        <h3 className="text-base font-semibold capitalize leading-tight tracking-[-0.01em]">
          {pokemon.name.replace(/-/g, " ")}
        </h3>
        <TypeChips types={pokemon.types} link={false} />
      </div>
    </Link>
  );
}

/** Responsive grid of cards used by every list page. */
export function PokemonGrid({
  pokemon,
  priorityCount = 0,
  className,
}: {
  pokemon: readonly CardPokemon[];
  /** How many leading cards are above the fold and should load eagerly. */
  priorityCount?: number;
  /** Override the column template, e.g. for a fixed-size featured row. */
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] sm:gap-4",
        className,
      )}
    >
      {pokemon.map((p, i) => (
        <PokemonCard key={p.id} pokemon={p} priority={i < priorityCount} />
      ))}
    </div>
  );
}
