"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchX, X } from "lucide-react";
import { pokemonIndex, type IndexPokemon } from "@/lib/pokemon-index";
import { isTypeName, ROMAN, TYPE_NAMES, typeVars } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PokemonGrid } from "../PokemonCard";
import { SearchField } from "../SearchField";
import { Button } from "../ui/button";

const PAGE_SIZE = 24;
const SORTS = {
  id: { label: "Dex number", fn: (a: IndexPokemon, b: IndexPokemon) => a.id - b.id },
  name: { label: "Name A–Z", fn: (a: IndexPokemon, b: IndexPokemon) => a.name.localeCompare(b.name) },
  "name-desc": { label: "Name Z–A", fn: (a: IndexPokemon, b: IndexPokemon) => b.name.localeCompare(a.name) },
} as const;
type SortKey = keyof typeof SORTS;

interface Filters {
  q: string;
  types: string[];
  gen: number | null;
  sort: SortKey;
}

function readFilters(params: URLSearchParams): Filters {
  const gen = Number(params.get("gen"));
  const sort = params.get("sort") as SortKey;
  return {
    q: params.get("q")?.slice(0, 40) ?? "",
    types: (params.get("type") ?? "").split(",").filter(isTypeName).slice(0, 2),
    gen: gen >= 1 && gen <= 9 ? gen : null,
    sort: sort in SORTS ? sort : "id",
  };
}

function toQueryString(f: Filters) {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set("q", f.q.trim());
  if (f.types.length) p.set("type", f.types.join(","));
  if (f.gen) p.set("gen", String(f.gen));
  if (f.sort !== "id") p.set("sort", f.sort);
  const s = p.toString();
  return s ? `?${s}` : "";
}

function apply(f: Filters) {
  const q = f.q.trim().toLowerCase().replace(/^#/, "");
  const words = q.split(/\s+/).filter(Boolean);
  const result = pokemonIndex.filter((p) => {
    if (f.gen && p.gen !== f.gen) return false;
    if (!f.types.every((t) => p.types.includes(t))) return false;
    if (!q) return true;
    if (/^\d+$/.test(q)) return String(p.id).startsWith(q);
    return words.every((w) => p.name.includes(w));
  });
  return f.sort === "id" ? result : [...result].sort(SORTS[f.sort].fn);
}

function Pill({
  active,
  onClick,
  children,
  className,
  style,
  label,
  activeClassName = "border-transparent bg-foreground text-background",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  activeClassName?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={label}
      onClick={onClick}
      style={style}
      className={cn(
        "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-sm font-medium outline-none transition-[background-color,border-color,color] duration-150 focus-visible:ring-[3px] focus-visible:ring-ring/50",
        active
          ? activeClassName
          : "bg-card text-muted-foreground hover:border-foreground/25 hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}

export default function SearchForm() {
  const params = useSearchParams();
  const [filters, setFilters] = useState<Filters>(() => readFilters(params));
  const [visible, setVisible] = useState(PAGE_SIZE);
  // Keep typing responsive even while a large grid re-renders.
  const deferred = useDeferredValue(filters);
  const results = useMemo(() => apply(deferred), [deferred]);
  const shown = results.slice(0, visible);
  const hasFilters = !!(filters.q || filters.types.length || filters.gen || filters.sort !== "id");

  // Mirror filters into the URL so every view can be shared or bookmarked.
  useEffect(() => {
    const next = toQueryString(filters);
    if (next !== window.location.search) {
      window.history.replaceState(null, "", `${window.location.pathname}${next}`);
    }
  }, [filters]);

  const update = (patch: Partial<Filters>) => {
    setFilters((f) => ({ ...f, ...patch }));
    setVisible(PAGE_SIZE);
  };

  const toggleType = (t: string) => {
    const has = filters.types.includes(t);
    // A Pokémon has at most two types, so keep the two most recent picks.
    update({
      types: has ? filters.types.filter((x) => x !== t) : [...filters.types, t].slice(-2),
    });
  };

  return (
    <div className="space-y-6">
      <div className="surface space-y-4 p-4 md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <SearchField
            id="pokedex-search"
            label="Search for a Pokémon"
            placeholder="Pikachu, char, #25…"
            value={filters.q}
            onChange={(q) => update({ q: q.slice(0, 40) })}
            className="md:max-w-sm"
          />
          <div className="flex items-center gap-2 md:ml-auto">
            <label htmlFor="sort" className="text-sm text-muted-foreground">
              Sort
            </label>
            <select
              id="sort"
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value as SortKey })}
              className="h-10 rounded-full border bg-card px-4 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              {Object.entries(SORTS).map(([key, s]) => (
                <option key={key} value={key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <fieldset>
          <legend className="eyebrow mb-2 text-muted-foreground">Generation</legend>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            <Pill active={!filters.gen} onClick={() => update({ gen: null })}>
              All
            </Pill>
            {ROMAN.slice(1).map((r, i) => (
              <Pill
                key={r}
                active={filters.gen === i + 1}
                onClick={() => update({ gen: filters.gen === i + 1 ? null : i + 1 })}
                className="font-mono"
                label={`Generation ${r}`}
              >
                {r}
              </Pill>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="eyebrow mb-2 text-muted-foreground">
            Type <span className="normal-case tracking-normal">(pick up to two)</span>
          </legend>
          <div className="flex flex-wrap gap-1.5">
            {TYPE_NAMES.map((t) => {
              const active = filters.types.includes(t);
              return (
                <Pill
                  key={t}
                  active={active}
                  onClick={() => toggleType(t)}
                  style={typeVars([t])}
                  className="pl-1 capitalize"
                  activeClassName="type-soft type-ink border-[var(--t)] ring-1 ring-[var(--t)]"
                >
                  <span
                    aria-hidden
                    className="grid size-6 place-items-center rounded-full p-1"
                    style={{ background: "var(--t)" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- tiny static SVG */}
                    <img src={`/typeImages/${t}.svg`} alt="" className="size-full" />
                  </span>
                  {t}
                </Pill>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground tabular-nums" aria-live="polite">
          {results.length} Pokémon
        </p>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full"
            onClick={() => update({ q: "", types: [], gen: null, sort: "id" })}
          >
            <X />
            Clear filters
          </Button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="surface flex flex-col items-center gap-3 px-6 py-16 text-center">
          <SearchX aria-hidden className="size-10 text-muted-foreground" />
          <p className="text-lg font-medium">No Pokémon match these filters</p>
          <p className="text-muted-foreground">
            Try another type combination or clear the filters.
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
