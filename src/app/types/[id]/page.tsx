import type { Metadata } from "next";
import { Container, PageHeader, Section } from "@/components/layout";
import { PokemonGrid } from "@/components/PokemonCard";
import DamageRelations from "@/components/typesPage/DamageRelations";
import { notFound } from "next/navigation";
import { pokemonIndex } from "@/lib/pokemon-index";
import { isTypeName, TYPE_NAMES, typeVars } from "@/lib/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return TYPE_NAMES.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const name = id.charAt(0).toUpperCase() + id.slice(1);
  return {
    title: `${name} type`,
    description: `${name}-type strengths, weaknesses and every ${name}-type Pokémon.`,
  };
}

export default async function TypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Built entirely from static data: no PokeAPI request, even at build time.
  if (!isTypeName(id)) notFound();
  const type = id;
  const pokemon = pokemonIndex.filter((p) => p.types.includes(type));

  return (
    <main style={typeVars([type])}>
      <PageHeader
        className="type-surface"
        eyebrow="Type"
        title={
          <span className="flex items-center gap-4 capitalize">
            <span
              aria-hidden
              className="grid size-14 shrink-0 place-items-center rounded-full p-3 shadow-md md:size-16"
              style={{ background: "var(--t)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- tiny static SVG */}
              <img src={`/typeImages/${type}.svg`} alt="" className="size-full" />
            </span>
            {type}
          </span>
        }
        description={`${pokemon.length} Pokémon have the ${type} type.`}
      />
      <Container>
        <Section title="Damage relations">
          <DamageRelations type={type} />
        </Section>
        <Section title={`${pokemon.length} Pokémon`} className="pt-0">
          <PokemonGrid pokemon={pokemon} />
        </Section>
      </Container>
    </main>
  );
}
