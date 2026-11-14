import type { Metadata } from "next";
import { Container, PageHeader, Section } from "@/components/layout";
import { PokemonGrid } from "@/components/PokemonCard";
import DamageRelations from "@/components/typesPage/DamageRelations";
import { pokeapi, slugOrNotFound } from "@/lib/pokeapi";
import { resolveRefs } from "@/lib/pokemon-index";
import { TYPE_NAMES, typeVars } from "@/lib/types";
import { TypeData } from "@/types/typeTypes";

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
  const typeData = await pokeapi<TypeData>(`type/${slugOrNotFound(id)}`);
  const pokemon = resolveRefs(typeData.pokemon.map((p) => p.pokemon));

  return (
    <main style={typeVars([typeData.name])}>
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
              <img src={`/typeImages/${typeData.name}.svg`} alt="" className="size-full" />
            </span>
            {typeData.name}
          </span>
        }
        description={`${pokemon.length} Pokémon have the ${typeData.name} type.`}
      />
      <Container>
        <Section title="Damage relations">
          <DamageRelations typeData={typeData} />
        </Section>
        <Section title={`${pokemon.length} Pokémon`} className="pt-0">
          <PokemonGrid pokemon={pokemon} />
        </Section>
      </Container>
    </main>
  );
}
