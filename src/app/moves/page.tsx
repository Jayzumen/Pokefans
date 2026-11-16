import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/layout";
import MoveCard from "@/components/movesPage/MoveCard";
import { NameSearch } from "@/components/NameSearch";
import names from "@/data/names.json";
import { MoveData } from "@/types/moveTypes";
import { pokeapiOr, randomIds } from "@/lib/pokeapi";

export const metadata: Metadata = {
  title: "Moves",
  description: "Every Pokémon move with type, power, accuracy and PP.",
};

// Re-pick the featured moves once per hour.
export const revalidate = 3600;

export default async function MovePage() {
  // The searchable list is static. The random featured cards are an extra:
  // if PokeAPI is unreachable, the page still renders (and builds) without them.
  const featured = (
    await Promise.all(
      randomIds(9, names.moves.length).map((i) =>
        pokeapiOr<MoveData | null>(`move/${names.moves[i - 1]}`, null),
      ),
    )
  ).filter((m): m is MoveData => m !== null);

  return (
    <main>
      <PageHeader
        eyebrow="Move-Dex"
        title="Moves"
        description="Search by name, or browse a random selection below. Each move shows its type, category, power, accuracy and PP."
      />
      <Container className="py-10">
        <NameSearch
          names={names.moves}
          basePath="/moves"
          noun="move"
          placeholder="Thunderbolt, fire…"
        >
          {featured.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((m) => (
                <MoveCard key={m.id} move={m} />
              ))}
            </div>
          ) : (
            <p className="surface px-6 py-10 text-center text-muted-foreground">
              Featured moves are unavailable right now. Search by name above.
            </p>
          )}
        </NameSearch>
      </Container>
    </main>
  );
}
