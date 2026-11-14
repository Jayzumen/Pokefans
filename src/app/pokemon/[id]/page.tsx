import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, ViewTransition } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/layout";
import { getPokemonDetail } from "@/components/pokemonPage/data";
import PokemonHero from "@/components/pokemonPage/Hero";
import { DetailBody, HeroExtras } from "@/components/pokemonPage/Sections";
import { Bone, DetailSkeleton } from "@/components/skeletons";
import { slugOrNotFound } from "@/lib/pokeapi";
import { artworkUrl, formatDexNumber } from "@/lib/pokemon";
import { findPokemon, getPokemonById } from "@/lib/pokemon-index";
import { titleCase, typeVars } from "@/lib/types";
import { cn } from "@/lib/utils";

// Pages are rendered on first request and then cached (ISR).
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const name = titleCase(id);
  return {
    title: `${name}: stats, evolutions & abilities`,
    description: `Base stats, types, matchups, evolutions, moves and forms of ${name}.`,
  };
}

function NeighborLink({ id, dir }: { id: number; dir: "prev" | "next" }) {
  const p = getPokemonById(id);
  if (!p) return <span />;
  const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
  return (
    <Link
      href={`/pokemon/${p.name}`}
      rel={dir}
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50",
        dir === "next" && "flex-row-reverse",
      )}
    >
      <Icon className="size-4" />
      <span className="font-mono tabular-nums">{formatDexNumber(p.id)}</span>
      <span className="hidden capitalize sm:inline">{p.name.replace(/-/g, " ")}</span>
    </Link>
  );
}

function ExtrasSkeleton() {
  return (
    <div className="mt-3 space-y-4" aria-hidden>
      <Bone className="h-5 w-40" />
      <Bone className="mt-8 h-11 w-36 rounded-full" />
    </div>
  );
}

function BodySkeleton() {
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2" aria-busy="true" aria-label="Loading">
      <Bone className="h-80 w-full rounded-[var(--radius)]" />
      <Bone className="h-80 w-full rounded-[var(--radius)]" />
    </div>
  );
}

/** Streams in with a short slide-up once the data has loaded. */
function Reveal({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="slide-up" default="none">
      {children}
    </ViewTransition>
  );
}

async function Extras({ slug }: { slug: string }) {
  const detail = await getPokemonDetail(slug);
  return (
    <Reveal>
      <div>
        <HeroExtras detail={detail} />
      </div>
    </Reveal>
  );
}

async function Body({ slug }: { slug: string }) {
  const detail = await getPokemonDetail(slug);
  return (
    <Reveal>
      <div>
        <DetailBody detail={detail} />
      </div>
    </Reveal>
  );
}

/** Alternate forms aren't in the static index: render everything from data. */
async function FormPage({ slug }: { slug: string }) {
  const detail = await getPokemonDetail(slug);
  const { pokemon, species } = detail;
  const types = pokemon.types.map((t) => t.type.name);
  return (
    <div style={typeVars(types)}>
      <PokemonHero
        id={pokemon.id}
        name={species.name}
        subtitle={pokemon.name.replace(`${species.name}-`, "").replace(/-/g, " ")}
        types={types}
        artwork={
          pokemon.sprites.other["official-artwork"].front_default ?? artworkUrl(pokemon.id)
        }
      >
        <HeroExtras detail={detail} />
      </PokemonHero>
      <DetailBody detail={detail} />
    </div>
  );
}

export default async function PokemonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const slug = slugOrNotFound(id);
  const entry = findPokemon(slug);

  if (!entry) {
    return (
      <main>
        <Container className="py-6 md:py-10">
          <Suspense fallback={<DetailSkeleton />}>
            <FormPage slug={slug} />
          </Suspense>
        </Container>
      </main>
    );
  }

  return (
    <main style={typeVars(entry.types)}>
      <Container className="py-6 md:py-10">
        <nav aria-label="Previous and next Pokémon" className="mb-3 flex justify-between">
          <NeighborLink id={entry.id - 1} dir="prev" />
          <NeighborLink id={entry.id + 1} dir="next" />
        </nav>

        {/* Known instantly from the index, so the artwork can morph in. */}
        <PokemonHero
          id={entry.id}
          name={entry.name}
          types={entry.types}
          artwork={artworkUrl(entry.id)}
        >
          <Suspense fallback={<ExtrasSkeleton />}>
            <Extras slug={entry.name} />
          </Suspense>
        </PokemonHero>

        <Suspense fallback={<BodySkeleton />}>
          <Body slug={entry.name} />
        </Suspense>
      </Container>
    </main>
  );
}
