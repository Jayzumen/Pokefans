import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Generations } from "@/assets/constants";
import { Container, PageHeader } from "@/components/layout";
import { PokemonGrid } from "@/components/PokemonCard";
import { getPokemonByGen } from "@/lib/pokemon-index";
import { REGIONS, ROMAN } from "@/lib/types";
import { cn } from "@/lib/utils";

// Every generation is built at compile time from the static index.
export const dynamicParams = false;

export function generateStaticParams() {
  return Generations.map((g) => ({ gen: g.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ gen: string }>;
}): Promise<Metadata> {
  const { gen } = await params;
  const n = Number(gen);
  return {
    title: `Generation ${ROMAN[n]} (${REGIONS[n]})`,
    description: `Every Pokémon introduced in Generation ${ROMAN[n]}, the ${REGIONS[n]} region.`,
  };
}

export default async function GenerationsPage({
  params,
}: {
  params: Promise<{ gen: string }>;
}) {
  const { gen } = await params;
  const n = Number(gen);
  if (!Generations.some((g) => g.id === gen)) notFound();
  const pokemon = getPokemonByGen(n);

  return (
    <main>
      <PageHeader
        eyebrow={`Generation ${ROMAN[n]}`}
        title={`The ${REGIONS[n]} region`}
        description={`${pokemon.length} Pokémon, from #${String(pokemon[0].id).padStart(3, "0")} to #${String(pokemon.at(-1)!.id).padStart(3, "0")}.`}
      >
        {/* Segmented control */}
        <nav
          aria-label="Generations"
          className="inline-flex max-w-full gap-1 overflow-x-auto rounded-full border bg-card p-1 shadow-xs"
        >
          {Generations.map((g) => {
            const active = g.id === gen;
            return (
              <Link
                key={g.id}
                href={`/generations/${g.id}`}
                aria-current={active ? "page" : undefined}
                title={REGIONS[Number(g.id)]}
                className={cn(
                  "grid h-9 min-w-11 shrink-0 place-items-center rounded-full px-3 font-mono text-sm font-medium outline-none transition-colors duration-200 focus-visible:ring-[3px] focus-visible:ring-ring/50",
                  active
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {g.name}
              </Link>
            );
          })}
        </nav>
      </PageHeader>
      <Container className="py-10">
        <h2 className="sr-only">Pokémon of Generation {ROMAN[n]}</h2>
        <PokemonGrid pokemon={pokemon} priorityCount={4} />
      </Container>
    </main>
  );
}
