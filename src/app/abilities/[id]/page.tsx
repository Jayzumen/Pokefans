import type { Metadata } from "next";
import { Container, PageHeader, Section } from "@/components/layout";
import { PokemonGrid } from "@/components/PokemonCard";
import { describe, english } from "@/lib/entries";
import { pokeapi, slugOrNotFound } from "@/lib/pokeapi";
import { resolveRefs } from "@/lib/pokemon-index";
import { cleanText, ROMAN, titleCase } from "@/lib/types";
import { AbilityData } from "@/types/abilityTypes";

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
  return { title: `${titleCase(id)} (ability)` };
}

const GEN_NUMBER: Record<string, number> = {
  i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8, ix: 9,
};

export default async function Ability({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ability = await pokeapi<AbilityData>(`ability/${slugOrNotFound(id)}`);
  const pokemon = resolveRefs((ability.pokemon ?? []).map((p) => p.pokemon));
  const longEffect = cleanText(english(ability.effect_entries)?.effect);
  const gen = GEN_NUMBER[ability.generation?.name.split("-")[1] ?? ""];

  return (
    <main>
      <PageHeader
        eyebrow={gen ? `Ability · introduced in Gen ${ROMAN[gen]}` : "Ability"}
        title={titleCase(ability.name)}
        description={describe(ability)}
      />
      <Container>
        {longEffect && (
          <Section title="Effect">
            <div className="surface p-6 leading-relaxed md:p-8">
              <p className="max-w-3xl">{longEffect}</p>
            </div>
          </Section>
        )}
        <Section
          title={`${pokemon.length} Pokémon can have it`}
          className={longEffect ? "pt-0" : undefined}
        >
          {pokemon.length > 0 ? (
            <PokemonGrid pokemon={pokemon} />
          ) : (
            <p className="text-muted-foreground">
              No Pokémon have this ability in the main series.
            </p>
          )}
        </Section>
      </Container>
    </main>
  );
}
