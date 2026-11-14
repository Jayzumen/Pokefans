import type { Metadata } from "next";
import { Container, PageHeader, Section, Spec } from "@/components/layout";
import { PokemonGrid } from "@/components/PokemonCard";
import { TypeChip } from "@/components/TypeChip";
import { describe, english } from "@/lib/entries";
import { pokeapi, slugOrNotFound } from "@/lib/pokeapi";
import { resolveRefs } from "@/lib/pokemon-index";
import { cleanText, titleCase, typeVars } from "@/lib/types";
import { MoveData } from "@/types/moveTypes";

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
  return { title: `${titleCase(id)} (move)` };
}

export default async function MovePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const move = await pokeapi<MoveData>(`move/${slugOrNotFound(id)}`);
  const pokemon = resolveRefs(move.learned_by_pokemon ?? []);
  const longEffect = cleanText(
    english(move.effect_entries)?.effect.replace(
      /\$effect_chance/g,
      String(move.effect_chance ?? ""),
    ),
  );

  return (
    <main style={typeVars([move.type.name])}>
      <PageHeader
        className="type-surface"
        eyebrow={<span className="capitalize">{move.damage_class?.name} move</span>}
        title={titleCase(move.name)}
        description={describe(move)}
      >
        <TypeChip type={move.type.name} size="md" />
      </PageHeader>
      <Container>
        <Section title="Details">
          <div className="surface grid gap-8 p-6 md:grid-cols-[1fr_2fr] md:p-8">
            <dl className="grid grid-cols-2 gap-6">
              <Spec label="Power" value={move.power ?? "—"} />
              <Spec label="Accuracy" value={move.accuracy ? `${move.accuracy}%` : "—"} />
              <Spec label="PP" value={move.pp ?? "—"} />
              <Spec
                label="Priority"
                value={move.priority > 0 ? `+${move.priority}` : move.priority}
              />
            </dl>
            <div>
              <h3 className="eyebrow text-muted-foreground">Effect</h3>
              <p className="mt-2 leading-relaxed">{longEffect || describe(move)}</p>
            </div>
          </div>
        </Section>
        <Section
          title={`Learned by ${pokemon.length} Pokémon`}
          className="pt-0"
        >
          {pokemon.length > 0 ? (
            <PokemonGrid pokemon={pokemon} />
          ) : (
            <p className="text-muted-foreground">No Pokémon learn this move.</p>
          )}
        </Section>
      </Container>
    </main>
  );
}
