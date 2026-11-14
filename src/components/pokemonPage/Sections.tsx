import Image from "next/image";
import Link from "next/link";
import { Spec } from "../layout";
import { english } from "@/lib/entries";
import { artworkUrl, idFromUrl } from "@/lib/pokemon";
import { getPokemonById } from "@/lib/pokemon-index";
import { cleanText, ROMAN, titleCase } from "@/lib/types";
import AddToTeamButton from "./AddToTeamButton";
import EvolutionChain from "./EvolutionChain";
import Matchups from "./Matchups";
import Moves from "./Moves";
import PokemonStats from "./PokemonStats";
import type { PokemonDetail } from "./data";

/** Genus, legendary/mythical tags and the add-to-team button. */
export function HeroExtras({ detail }: { detail: PokemonDetail }) {
  const { pokemon, species } = detail;
  const genus = english(species.genera)?.genus;
  const tags = [
    species.is_legendary && "Legendary",
    species.is_mythical && "Mythical",
    species.is_baby && "Baby",
  ].filter(Boolean) as string[];

  return (
    <>
      {genus && <p className="mt-3 text-lg text-muted-foreground">{genus}</p>}
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
      <div className="mt-8">
        <AddToTeamButton
          member={{
            id: pokemon.id,
            name: pokemon.name,
            types: pokemon.types.map((t) => t.type.name),
            bst: pokemon.stats.reduce((s, x) => s + x.base_stat, 0),
          }}
        />
      </div>
    </>
  );
}

function SectionBlock({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-40 pt-10">
      <h2 id={`${id}-title`} className="mb-4 text-2xl font-semibold tracking-[-0.02em]">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function DetailBody({ detail }: { detail: PokemonDetail }) {
  const { pokemon, species, chain } = detail;
  const types = pokemon.types.map((t) => t.type.name);
  const flavor = cleanText(
    [...species.flavor_text_entries].reverse().find((e) => e.language.name === "en")
      ?.flavor_text,
  );
  const gen = getPokemonById(species.id)?.gen;
  const artwork = pokemon.sprites.other["official-artwork"];
  const varieties = species.varieties.filter(
    (v) => v.pokemon.name !== pokemon.name,
  );
  const hasEvolution = !!chain && chain.chain.evolves_to.length > 0;
  const hasForms = !!artwork.front_shiny || varieties.length > 0;

  const nav = [
    { id: "overview", label: "Overview" },
    { id: "matchups", label: "Matchups" },
    hasEvolution && { id: "evolution", label: "Evolution" },
    { id: "moves", label: "Moves" },
    hasForms && { id: "forms", label: "Forms" },
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <>
      {/* Sticky in-page navigation */}
      <nav
        aria-label="Sections"
        className="sticky top-20 z-30 mt-6 -mx-1 overflow-x-auto px-1"
      >
        <ul className="inline-flex gap-1 rounded-full border bg-background/80 p-1 shadow-sm backdrop-blur-xl">
          {nav.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                className="block rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div id="overview" className="grid scroll-mt-40 gap-6 pt-6 lg:grid-cols-2">
        <section className="surface p-6 md:p-8" aria-labelledby="about">
          <h2 id="about" className="text-xl font-semibold">About</h2>
          {flavor && (
            <p className="mt-3 leading-relaxed text-muted-foreground">{flavor}</p>
          )}
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

      <SectionBlock id="matchups" title="Type matchups">
        <Matchups types={types} />
      </SectionBlock>

      {hasEvolution && (
        <SectionBlock id="evolution" title="Evolution">
          <div className="surface overflow-x-auto p-6 md:p-8">
            <EvolutionChain root={chain!.chain} current={species.name} />
          </div>
        </SectionBlock>
      )}

      <SectionBlock id="moves" title="Moves">
        <Moves moves={pokemon.moves} />
      </SectionBlock>

      {hasForms && (
        <SectionBlock id="forms" title="Forms">
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
                  {v.is_default
                    ? "Default"
                    : v.pokemon.name.replace(`${species.name}-`, "").replace(/-/g, " ")}
                </p>
              </Link>
            ))}
          </div>
        </SectionBlock>
      )}
    </>
  );
}
