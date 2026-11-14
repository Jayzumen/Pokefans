import Image from "next/image";
import { ViewTransition } from "react";
import { formatDexNumber } from "@/lib/pokemon";
import { artworkTransitionName } from "@/lib/pokemon-index";
import { TypeChips } from "../TypeChip";

/**
 * Detail-page hero. Everything here is known before any data loads (it
 * comes from the static index), so it renders in the same commit as the
 * navigation and the artwork can morph from the card the user clicked.
 * `children` holds the streamed extras (genus, tags, add-to-team).
 */
export default function PokemonHero({
  id,
  name,
  subtitle,
  types,
  artwork,
  children,
}: {
  id: number;
  name: string;
  subtitle?: string;
  types: string[];
  artwork: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="surface type-surface relative grid items-center gap-6 overflow-hidden p-6 md:grid-cols-2 md:p-10">
      <div aria-hidden className="dot-grid absolute inset-0 opacity-50" />
      <div className="relative">
        <p className="font-mono text-sm text-muted-foreground tabular-nums">
          {formatDexNumber(id)}
        </p>
        <h1 className="mt-1 text-5xl font-semibold capitalize tracking-[-0.04em] md:text-6xl">
          {name.replace(/-/g, " ")}
        </h1>
        {subtitle && (
          <p className="mt-1 text-lg text-muted-foreground capitalize">{subtitle}</p>
        )}
        <TypeChips types={types} size="md" className="mt-5" />
        {children}
      </div>
      <ViewTransition
        name={artworkTransitionName(id)}
        share="morph"
        default="none"
      >
        <Image
          src={artwork}
          alt={`${name} official artwork`}
          width={420}
          height={420}
          priority
          sizes="(min-width: 768px) 420px, 80vw"
          className="relative mx-auto aspect-square w-full max-w-[420px] object-contain drop-shadow-[0_24px_32px_oklch(0_0_0/0.22)]"
        />
      </ViewTransition>
    </section>
  );
}
