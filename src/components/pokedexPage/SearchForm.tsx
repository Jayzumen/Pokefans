"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { pokemonIndex } from "@/lib/pokemon-index";
import { PokemonGrid } from "../PokemonCard";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const PAGE_SIZE = 24;

function matches(query: string) {
  const q = query.trim().toLowerCase().replace(/^#/, "");
  if (!q) return pokemonIndex;
  if (/^\d+$/.test(q)) {
    const id = Number(q);
    return pokemonIndex.filter((p) => p.id === id || String(p.id).startsWith(q));
  }
  const words = q.split(/\s+/);
  return pokemonIndex.filter((p) => words.every((w) => p.name.includes(w)));
}

export default function SearchForm() {
  const [query, setQuery] = useState("");
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
    <div className="space-y-8">
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="relative"
      >
        <Label htmlFor="search" className="sr-only">
          Search for a Pokémon
        </Label>
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          id="search"
          name="search"
          autoComplete="off"
          placeholder="Pikachu, char, #25…"
          value={query}
          onChange={(e) => updateQuery(e.target.value)}
          className="h-12 pr-12 pl-12 text-lg [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => updateQuery("")}
            className="absolute top-1/2 right-2 -translate-y-1/2"
            aria-label="Clear search"
          >
            <X />
          </Button>
        )}
      </form>

      <div className="space-y-6">
        <p className="text-center text-muted-foreground" aria-live="polite">
          {deferredQuery.trim()
            ? `${results.length} Pokémon match “${deferredQuery.trim()}”`
            : `All ${results.length} Pokémon`}
        </p>

        {results.length === 0 ? (
          <p className="py-12 text-center text-lg">
            No Pokémon found. Check the spelling or try part of the name.
          </p>
        ) : (
          <PokemonGrid pokemon={shown} priorityCount={4} />
        )}

        {results.length > visible && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
            >
              Show more ({results.length - visible} left)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
