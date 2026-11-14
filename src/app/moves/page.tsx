import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/layout";
import MoveCard from "@/components/movesPage/MoveCard";
import { NameSearch } from "@/components/NameSearch";
import { Move, MoveData } from "@/types/moveTypes";
import { pokeapi, randomIds } from "@/lib/pokeapi";

export const metadata: Metadata = {
  title: "Moves",
  description: "Every Pokémon move with type, power, accuracy and PP.",
};

// Re-pick the featured moves once per hour.
export const revalidate = 3600;
const MAX_MOVE_ID = 900;

export default async function MovePage() {
  const [featured, list] = await Promise.all([
    Promise.all(
      randomIds(9, MAX_MOVE_ID).map((id) => pokeapi<MoveData>(`move/${id}`)),
    ),
    pokeapi<{ results: Move[] }>("move?limit=2000"),
  ]);

  return (
    <main>
      <PageHeader
        eyebrow="Move-Dex"
        title="Moves"
        description="Search by name, or browse a random selection below. Each move shows its type, category, power, accuracy and PP."
      />
      <Container className="py-10">
        <NameSearch
          names={list.results.map((m) => m.name)}
          basePath="/moves"
          noun="move"
          placeholder="Thunderbolt, fire…"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((m) => (
              <MoveCard key={m.id} move={m} />
            ))}
          </div>
        </NameSearch>
      </Container>
    </main>
  );
}
