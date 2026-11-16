"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { CornerDownLeft, Search, Sparkles, Swords, FileText } from "lucide-react";
import names from "@/data/names.json";
import { artworkUrl, formatDexNumber } from "@/lib/pokemon";
import { pokemonIndex } from "@/lib/pokemon-index";
import { titleCase, TYPE_NAMES, typeVars } from "@/lib/types";
import { cn } from "@/lib/utils";

type Item = {
  id: string;
  group: "Pokémon" | "Types" | "Moves" | "Abilities" | "Pages";
  label: string;
  href: string;
  hint?: string;
  icon: React.ReactNode;
};

const PAGES = [
  { label: "Pokédex", href: "/pokedex" },
  { label: "Generations", href: "/generations/1" },
  { label: "Types & type chart", href: "/types" },
  { label: "Moves", href: "/moves" },
  { label: "Abilities", href: "/abilities" },
  { label: "Teams", href: "/teams" },
  { label: "Sign in", href: "/login" },
];

/** Higher is better; 0 means no match. Prefix > word start > substring > subsequence. */
function score(candidate: string, q: string) {
  const c = candidate.replace(/-/g, " ");
  if (c === q) return 100;
  if (c.startsWith(q)) return 80 - c.length / 100;
  if (c.includes(` ${q}`)) return 60 - c.length / 100;
  if (c.includes(q)) return 40 - c.length / 100;
  let i = 0;
  for (const ch of c) if (ch === q[i]) i++;
  return i === q.length ? 10 - c.length / 100 : 0;
}

function top<T>(items: readonly T[], key: (t: T) => string, q: string, n: number) {
  return items
    .map((t) => ({ t, s: score(key(t), q) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map((x) => x.t);
}

function search(raw: string): Item[] {
  const q = raw.trim().toLowerCase().replace(/^#/, "");
  if (!q) {
    return PAGES.map((p) => ({
      id: `page-${p.href}`,
      group: "Pages",
      label: p.label,
      href: p.href,
      icon: <FileText className="size-4" />,
    }));
  }

  const pokemon = /^\d+$/.test(q)
    ? pokemonIndex.filter((p) => String(p.id).startsWith(q)).slice(0, 8)
    : top(pokemonIndex, (p) => p.name, q, 8);

  return [
    ...pokemon.map<Item>((p) => ({
      id: `pokemon-${p.id}`,
      group: "Pokémon",
      label: p.name.replace(/-/g, " "),
      href: `/pokemon/${p.name}`,
      hint: formatDexNumber(p.id),
      icon: (
        // eslint-disable-next-line @next/next/no-img-element -- small static WebP thumbnail
        <img
          src={artworkUrl(p.id)}
          loading="lazy"
          alt=""
          className="size-8 rounded-md object-contain"
          style={typeVars(p.types)}
        />
      ),
    })),
    ...top(TYPE_NAMES, (t) => t, q, 3).map<Item>((t) => ({
      id: `type-${t}`,
      group: "Types",
      label: t,
      href: `/types/${t}`,
      icon: (
        <span
          className="grid size-6 place-items-center rounded-full p-1"
          style={{ ...typeVars([t]), background: "var(--t)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- tiny static SVG */}
          <img src={`/typeImages/${t}.svg`} alt="" className="size-full" />
        </span>
      ),
    })),
    ...top(names.moves, (m) => m, q, 5).map<Item>((m) => ({
      id: `move-${m}`,
      group: "Moves",
      label: titleCase(m),
      href: `/moves/${m}`,
      icon: <Swords className="size-4" />,
    })),
    ...top(names.abilities, (a) => a, q, 5).map<Item>((a) => ({
      id: `ability-${a}`,
      group: "Abilities",
      label: titleCase(a),
      href: `/abilities/${a}`,
      icon: <Sparkles className="size-4" />,
    })),
    ...top(PAGES, (p) => p.label.toLowerCase(), q, 3).map<Item>((p) => ({
      id: `page-${p.href}`,
      group: "Pages",
      label: p.label,
      href: p.href,
      icon: <FileText className="size-4" />,
    })),
  ];
}

export default function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const items = useMemo(() => search(query), [query]);
  const activeIndex = Math.min(active, Math.max(items.length - 1, 0));

  const go = (item: Item | undefined) => {
    if (!item) return;
    onOpenChange(false);
    setQuery("");
    router.push(item.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((activeIndex + 1) % Math.max(items.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((activeIndex - 1 + items.length) % Math.max(items.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(items[activeIndex]);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-background/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed top-[12vh] left-1/2 z-[70] w-[min(36rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-[var(--radius-xl)] border bg-popover shadow-lg outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">Search Pokéfans</Dialog.Title>
          <div className="flex items-center gap-3 border-b px-4">
            <Search aria-hidden className="size-5 text-muted-foreground" />
            <input
              autoFocus
              role="combobox"
              aria-expanded="true"
              aria-controls="palette-results"
              aria-activedescendant={items[activeIndex]?.id}
              aria-autocomplete="list"
              placeholder="Search Pokémon, moves, abilities, types…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value.slice(0, 40));
                setActive(0);
              }}
              onKeyDown={onKeyDown}
              className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden rounded border px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground sm:block">
              Esc
            </kbd>
          </div>

          <ul
            id="palette-results"
            role="listbox"
            aria-label="Results"
            className="max-h-[min(60vh,28rem)] overflow-y-auto p-2"
          >
            {items.length === 0 && (
              <li className="px-3 py-10 text-center text-sm text-muted-foreground">
                Nothing found for “{query.trim()}”.
              </li>
            )}
            {items.map((item, i) => {
              const header = item.group !== items[i - 1]?.group ? item.group : null;
              return (
                <li key={item.id} role="presentation">
                  {header && (
                    <p
                      role="presentation"
                      className="eyebrow px-3 pt-3 pb-1.5 text-muted-foreground"
                    >
                      {header}
                    </p>
                  )}
                  <div
                    id={item.id}
                    role="option"
                    aria-selected={i === activeIndex}
                    onMouseMove={() => setActive(i)}
                    onClick={() => go(item)}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm",
                      i === activeIndex && "bg-accent",
                    )}
                  >
                    <span className="grid size-8 shrink-0 place-items-center text-muted-foreground">
                      {item.icon}
                    </span>
                    <span className="flex-1 truncate font-medium capitalize">
                      {item.label}
                    </span>
                    {item.hint && (
                      <span className="font-mono text-xs text-muted-foreground tabular-nums">
                        {item.hint}
                      </span>
                    )}
                    {i === activeIndex && (
                      <CornerDownLeft aria-hidden className="size-4 text-muted-foreground" />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
