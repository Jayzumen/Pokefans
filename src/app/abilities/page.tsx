import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHeader } from "@/components/layout";
import { NameSearch } from "@/components/NameSearch";
import { describe } from "@/lib/entries";
import { pokeapi, randomIds } from "@/lib/pokeapi";
import { titleCase } from "@/lib/types";
import { Ability, AbilityData } from "@/types/abilityTypes";

export const metadata: Metadata = {
  title: "Abilities",
  description: "Every Pokémon ability, what it does and who can have it.",
};

// Re-pick the featured abilities once per hour.
export const revalidate = 3600;
const MAX_ABILITY_ID = 298;

export default async function AbilityPage() {
  const [featured, list] = await Promise.all([
    Promise.all(
      randomIds(9, MAX_ABILITY_ID).map((id) =>
        pokeapi<AbilityData>(`ability/${id}`),
      ),
    ),
    pokeapi<{ results: Ability[] }>("ability?limit=400"),
  ]);

  return (
    <main>
      <PageHeader
        eyebrow="Ability-Dex"
        title="Abilities"
        description="Passive effects that shape how a Pokémon battles. Search by name or browse a random selection."
      />
      <Container className="py-10">
        <NameSearch
          names={list.results.map((a) => a.name)}
          basePath="/abilities"
          noun="ability"
          placeholder="Levitate, intimidate…"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((a) => (
              <Link
                key={a.id}
                href={`/abilities/${a.name}`}
                className="surface lift flex flex-col gap-2 p-5 outline-none hover:border-foreground/20 focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <h3 className="text-lg font-semibold tracking-[-0.01em]">
                  {titleCase(a.name)}
                </h3>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {describe(a)}
                </p>
                <p className="mt-auto pt-2 font-mono text-xs text-muted-foreground tabular-nums">
                  {a.pokemon.length} Pokémon
                </p>
              </Link>
            ))}
          </div>
        </NameSearch>
      </Container>
    </main>
  );
}
