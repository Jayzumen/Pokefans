"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchX } from "lucide-react";
import { pokemonIndex } from "@/lib/pokemon-index";
import { PokemonGrid } from "../PokemonCard";
import { SearchField } from "../SearchField";
import { Button } from "../ui/button";

const PAGE_SIZE = 24;

function matches(query: string) {
  const q = query.trim().toLowerCase().replace(/^#/, "");
  if (!q) return pokemonIndex;
  if (/^\d+$/.test(q)) {
    const id = Number(q);
    return pokemonIndex.filter(
      (p) => p.id === id || String(p.id).startsWith(q),
    );
  }
  const words = q.split(/\s+/);
  return pokemonIndex.filter((p) => words.every((w) => p.name.includes(w)));
}

export default function SearchForm() {
  // Allow deep links like /pokedex?q=char (used by the home page search).
  const initial = useSearchParams().get("q")?.slice(0, 40) ?? "";
  const [query, setQuery] = useState(initial);
  const [visible, setVisible] = useState(PAGE_SIZE);
  // Keep typing responsive even while a large grid re-renders.
  const deferredQuery = useDeferredValue(query);
  const results = useMemo(() => matches(deferredQuery), [deferredQuery]);
  const shown = results.slice(0, visible);

  const updateQuery = (value: string) => {
    setQuery(value.slice(0, 40));
    setVisible(PAGE_SIZE);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchField
          id="pokedex-search"
          label="Search for a Pokémon"
          placeholder="Pikachu, char, #25…"
          value={query}
          onChange={updateQuery}
          className="sm:max-w-md"
        />
        <p className="text-sm text-muted-foreground tabular-nums" aria-live="polite">
          {deferredQuery.trim()
            ? `${results.length} result${results.length === 1 ? "" : "s"}`
            : `${results.length} Pokémon`}
        </p>
      </div>

      {results.length === 0 ? (
        <div className="surface flex flex-col items-center gap-3 px-6 py-16 text-center">
          <SearchX aria-hidden className="size-10 text-muted-foreground" />
          <p className="text-lg font-medium">No Pokémon found</p>
          <p className="text-muted-foreground">
            Check the spelling or try part of the name.
          </p>
        </div>
      ) : (
        <PokemonGrid pokemon={shown} priorityCount={4} />
      )}

      {results.length > visible && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
          >
            Show more
            <span className="font-mono text-muted-foreground tabular-nums">
              {results.length - visible}
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}
