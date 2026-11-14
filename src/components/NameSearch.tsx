"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SearchField } from "./SearchField";
import { titleCase } from "@/lib/types";

const LIMIT = 60;

/**
 * Instant client-side search over a list of names (moves, abilities).
 * Shows `children` (the featured cards) while the query is empty.
 */
export function NameSearch({
  names,
  basePath,
  noun,
  plural = `${noun}s`,
  placeholder,
  children,
}: {
  names: string[];
  basePath: string;
  noun: string;
  /** Defaults to noun + "s"; pass e.g. "abilities". */
  plural?: string;
  placeholder: string;
  children: React.ReactNode;
}) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query.trim().toLowerCase());
  const results = useMemo(() => {
    if (!deferred) return [];
    const words = deferred.replace(/\s+/g, " ").split(" ");
    return names.filter((n) => {
      const plain = n.replace(/-/g, " ");
      return words.every((w) => plain.includes(w));
    });
  }, [deferred, names]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchField
          id={`${noun}-search`}
          label={`Search ${plural}`}
          placeholder={placeholder}
          value={query}
          onChange={(v) => setQuery(v.slice(0, 40))}
          className="sm:max-w-md"
        />
        <p className="text-sm text-muted-foreground tabular-nums" aria-live="polite">
          {deferred
            ? `${results.length} result${results.length === 1 ? "" : "s"}`
            : `${names.length} ${plural}`}
        </p>
      </div>

      {/* Keeps the heading outline intact (h1 → h2 → the cards' h3). */}
      <h2 className="sr-only">
        {deferred ? "Search results" : `Featured ${plural}`}
      </h2>
      {!deferred ? (
        children
      ) : results.length === 0 ? (
        <p className="surface px-6 py-12 text-center text-muted-foreground">
          No {noun} matches “{query.trim()}”.
        </p>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {results.slice(0, LIMIT).map((name) => (
            <li key={name}>
              <Link
                href={`${basePath}/${name}`}
                className="surface group flex items-center justify-between px-4 py-3 outline-none transition-colors duration-150 hover:border-foreground/20 focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <span className="font-medium">{titleCase(name)}</span>
                <ArrowRight className="size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      )}
      {results.length > LIMIT && (
        <p className="text-center text-sm text-muted-foreground">
          Showing the first {LIMIT}. Keep typing to narrow it down.
        </p>
      )}
    </div>
  );
}
