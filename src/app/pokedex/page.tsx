import { Suspense } from "react";
import type { Metadata } from "next";
import SearchForm from "@/components/pokedexPage/SearchForm";
import { Container, PageHeader } from "@/components/layout";
import { GridSkeleton } from "@/components/skeletons";
import { pokemonIndex } from "@/lib/pokemon-index";

export const metadata: Metadata = {
  title: "Pokédex",
  description: "Search every Pokémon by name or national dex number.",
};

// Fully static: search runs in the browser against the bundled index.
export default function Pokedex() {
  return (
    <main>
      <PageHeader
        eyebrow="National Pokédex"
        title="Pokédex"
        description={`All ${pokemonIndex.length.toLocaleString("en-US")} Pokémon. Type a name or a dex number, results update as you type.`}
      />
      <Container className="py-10">
        {/* useSearchParams (for ?q=) needs a Suspense boundary */}
        <Suspense fallback={<GridSkeleton />}>
          <SearchForm />
        </Suspense>
      </Container>
    </main>
  );
}
