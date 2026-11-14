import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container, Section, Spec } from "@/components/layout";
import AddToTeamButton from "@/components/pokemonPage/AddToTeamButton";
import EvolutionChain from "@/components/pokemonPage/EvolutionChain";
import PokemonStats from "@/components/pokemonPage/PokemonStats";
import { TypeChips } from "@/components/TypeChip";
import { english } from "@/lib/entries";
import { pokeapi, slugOrNotFound } from "@/lib/pokeapi";
import { artworkUrl, formatDexNumber, idFromUrl } from "@/lib/pokemon";
import { getPokemonById } from "@/lib/pokemon-index";
import { cleanText, ROMAN, titleCase, typeVars } from "@/lib/types";
import { cn } from "@/lib/utils";
import { EvolutionChain as Chain, PokemonData, Species } from "@/types/pokemonTypes";

async function getPokemonData(pokemonId: string) {
  const pokemon = await pokeapi<PokemonData>(`pokemon/${pokemonId}`);
  const species = await pokeapi<Species>(pokemon.species.url);
  const chain = species.evolution_chain?.url
    ? await pokeapi<Chain>(species.evolution_chain.url)
    : undefined;
  return { pokemon, species, chain };
}

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
    description: `Base stats, types, evolutions, abilities and forms of ${name}.`,
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

export default async function PokemonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { pokemon, species, chain } = await getPokemonData(slugOrNotFound(id));

  const types = pokemon.types.map((t) => t.type.name);
  const genus = english(species.genera)?.genus;
  const flavor = cleanText(
    [...species.flavor_text_entries].reverse().find((e) => e.language.name === "en")
      ?.flavor_text,
  );
  const artwork = pokemon.sprites.other["official-artwork"];
  const varieties = species.varieties.filter((v) => !v.is_default);
  const dexId = species.id;
  const gen = getPokemonById(dexId)?.gen;
  const tags = [
    species.is_legendary && "Legendary",
    species.is_mythical && "Mythical",
    species.is_baby && "Baby",
  ].filter(Boolean) as string[];

  return (
    <main style={typeVars(types)}>
      <Container className="py-6 md:py-10">
        <nav aria-label="Previous and next Pokémon" className="mb-3 flex justify-between">
          <NeighborLink id={dexId - 1} dir="prev" />
          <NeighborLink id={dexId + 1} dir="next" />
        </nav>

        {/* Hero */}
        <section className="surface type-surface relative grid items-center gap-6 overflow-hidden p-6 md:grid-cols-2 md:p-10">
          <div aria-hidden className="dot-grid absolute inset-0 opacity-50" />
          <div className="relative">
            <p className="fade-up font-mono text-sm text-muted-foreground tabular-nums">
              {formatDexNumber(pokemon.id)}
            </p>
            <h1 className="fade-up mt-1 text-5xl font-semibold capitalize tracking-[-0.04em] md:text-6xl">
              {species.name.replace(/-/g, " ")}
            </h1>
            {pokemon.name !== species.name && (
              <p className="mt-1 text-lg text-muted-foreground capitalize">
                {pokemon.name.replace(/-/g, " ")}
              </p>
            )}
            {genus && <p className="fade-up mt-2 text-lg text-muted-foreground">{genus}</p>}
            <TypeChips types={types} size="md" className="fade-up mt-5" />
            {tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="eyebrow rounded-full border bg-background/60 px-2.5 py-1 text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            <div className="fade-up mt-8">
              <AddToTeamButton
                member={{
                  id: pokemon.id,
                  name: pokemon.name,
                  types,
                  bst: pokemon.stats.reduce((s, x) => s + x.base_stat, 0),
                }}
              />
            </div>
          </div>
          {artwork.front_default && (
            <Image
              src={artwork.front_default}
              alt={`${pokemon.name} official artwork`}
              width={420}
              height={420}
              priority
              sizes="(min-width: 768px) 420px, 80vw"
              className="relative mx-auto aspect-square w-full max-w-[420px] object-contain drop-shadow-[0_24px_32px_oklch(0_0_0/0.22)]"
            />
          )}
        </section>

        {/* About + stats */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="surface p-6 md:p-8" aria-labelledby="about">
            <h2 id="about" className="text-xl font-semibold">About</h2>
            {flavor && <p className="mt-3 leading-relaxed text-muted-foreground">{flavor}</p>}
            <dl className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3">
              <Spec label="Height" value={`${pokemon.height / 10} m`} />
              <Spec label="Weight" value={`${pokemon.weight / 10} kg`} />
              {gen && <Spec label="Generation" value={ROMAN[gen]} />}
            </dl>
            <h3 className="eyebrow mt-8 text-muted-foreground">Abilities</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {pokemon.abilities.map((a) => (
                <li key={a.ability.name}>
                  <Link
                    href={`/abilities/${a.ability.name}`}
                    className="inline-flex h-9 items-center gap-2 rounded-full border bg-card px-4 text-sm font-medium outline-none transition-colors hover:border-foreground/25 hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    {titleCase(a.ability.name)}
                    {a.is_hidden && (
                      <span className="text-xs text-muted-foreground">hidden</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="surface p-6 md:p-8" aria-labelledby="stats">
            <h2 id="stats" className="mb-5 text-xl font-semibold">Base stats</h2>
            <PokemonStats stats={pokemon.stats} />
          </section>
        </div>

        {chain && chain.chain.evolves_to.length > 0 && (
          <Section title="Evolution">
            <div className="surface overflow-x-auto p-6 md:p-8">
              <EvolutionChain root={chain.chain} current={species.name} />
            </div>
          </Section>
        )}

        {(artwork.front_shiny || varieties.length > 0) && (
          <Section title="Forms" className={chain?.chain.evolves_to.length ? "pt-0" : undefined}>
            <div className="flex flex-wrap gap-4">
              {artwork.front_shiny && (
                <figure className="surface w-36 p-2 text-center">
                  <div className="type-surface grid aspect-square place-items-center rounded-[calc(var(--radius)-6px)]">
                    <Image
                      src={artwork.front_shiny}
                      alt={`Shiny ${pokemon.name}`}
                      width={120}
                      height={120}
                      className="size-[85%] object-contain"
                    />
                  </div>
                  <figcaption className="mt-2 text-sm font-medium">Shiny</figcaption>
                </figure>
              )}
              {varieties.map((v) => (
                <Link
                  key={v.pokemon.name}
                  href={`/pokemon/${v.pokemon.name}`}
                  className="surface lift w-36 p-2 text-center outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <div className="type-surface grid aspect-square place-items-center rounded-[calc(var(--radius)-6px)]">
                    <Image
                      src={artworkUrl(idFromUrl(v.pokemon.url))}
                      alt=""
                      width={120}
                      height={120}
                      className="size-[85%] object-contain"
                    />
                  </div>
                  <p className="mt-2 text-sm font-medium capitalize">
                    {v.pokemon.name.replace(`${species.name}-`, "").replace(/-/g, " ")}
                  </p>
                </Link>
              ))}
            </div>
          </Section>
        )}
      </Container>
    </main>
  );
}
