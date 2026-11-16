import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHeader } from "@/components/layout";
import { NameSearch } from "@/components/NameSearch";
import { describe } from "@/lib/entries";
import { pokeapiOr, randomIds } from "@/lib/pokeapi";
import { titleCase } from "@/lib/types";
import names from "@/data/names.json";
import { AbilityData } from "@/types/abilityTypes";

export const metadata: Metadata = {
  title: "Abilities",
  description: "Every Pokémon ability, what it does and who can have it.",
};

// Re-pick the featured abilities once per hour.
export const revalidate = 3600;

export default async function AbilityPage() {
  // The searchable list is static. The random featured cards are an extra:
  // if PokeAPI is unreachable, the page still renders (and builds) without them.
  const featured = (
    await Promise.all(
      randomIds(9, names.abilities.length).map((i) =>
        pokeapiOr<AbilityData | null>(`ability/${names.abilities[i - 1]}`, null),
      ),
    )
  ).filter((a): a is AbilityData => a !== null);

  return (
    <main>
      <PageHeader
        eyebrow="Ability-Dex"
        title="Abilities"
        description="Passive effects that shape how a Pokémon battles. Search by name or browse a random selection."
      />
      <Container className="py-10">
        <NameSearch
          names={names.abilities}
          basePath="/abilities"
          noun="ability"
          plural="abilities"
          placeholder="Levitate, intimidate…"
        >
          {featured.length === 0 && (
            <p className="surface px-6 py-10 text-center text-muted-foreground">
              Featured abilities are unavailable right now. Search by name above.
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 empty:hidden">
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
