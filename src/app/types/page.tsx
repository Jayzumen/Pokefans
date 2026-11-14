import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHeader, Section } from "@/components/layout";
import TypeChart from "@/components/typesPage/TypeChart";
import { pokemonIndex } from "@/lib/pokemon-index";
import { TYPE_NAMES, typeVars } from "@/lib/types";

export const metadata: Metadata = {
  title: "Types",
  description: "All 18 Pokémon types with their strengths, weaknesses and Pokémon.",
};

export default function TypesPage() {
  // Count Pokémon per type from the static index.
  const counts = new Map<string, number>();
  for (const p of pokemonIndex) {
    for (const t of p.types) counts.set(t, (counts.get(t) ?? 0) + 1);
  }

  return (
    <main>
      <PageHeader
        eyebrow="Type chart"
        title="Types"
        description="Every Pokémon has one or two types. They decide which attacks hit hard and which barely scratch."
      />
      <Container className="py-10">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {TYPE_NAMES.map((type) => (
            <li key={type}>
              <Link
                href={`/types/${type}`}
                style={typeVars([type])}
                className="surface lift type-surface group flex flex-col items-center gap-3 px-4 py-6 text-center outline-none hover:border-[color-mix(in_oklch,var(--t)_45%,var(--border))] focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <span
                  aria-hidden
                  className="grid size-14 place-items-center rounded-full p-3 shadow-md transition-transform duration-300 ease-out group-hover:scale-110 motion-reduce:transition-none"
                  style={{ background: "var(--t)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- tiny static SVG */}
                  <img src={`/typeImages/${type}.svg`} alt="" className="size-full" />
                </span>
                <span className="type-ink text-base font-semibold capitalize">
                  {type}
                </span>
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  {counts.get(type) ?? 0} Pokémon
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Section
          title="Type chart"
          description="Every attacking type against every defending type. Hover or tab through a cell to trace its row and column."
        >
          <TypeChart />
        </Section>
      </Container>
    </main>
  );
}
