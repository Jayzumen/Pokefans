"use client";

import { useId, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { METHODS, type GameInfo, type LearnMethod, type LearnsetData } from "@/lib/learnset";
import { ROMAN, titleCase } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TypeChip } from "../TypeChip";

const subscribe = (cb: () => void) => {
  window.addEventListener("popstate", cb);
  return () => window.removeEventListener("popstate", cb);
};
const readGameParam = () => new URLSearchParams(window.location.search).get("game");

/** Newest main-series game first; spin-offs and Japan-only releases last. */
function preferred(games: GameInfo[]) {
  return [...games].sort((a, b) => Number(a.side) - Number(b.side) || b.order - a.order)[0];
}

/** A row of pill-shaped radio buttons (native radios: keyboard support for free). */
function RadioPills<T extends string | number>({
  name,
  legend,
  options,
  value,
  onChange,
}: {
  name: string;
  legend: string;
  options: { value: T; label: React.ReactNode; title?: string; muted?: boolean }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="eyebrow mb-2 text-muted-foreground">{legend}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <label
            key={String(o.value)}
            title={o.title}
            className={cn(
              "inline-flex h-8 cursor-pointer items-center rounded-full border px-3 text-sm font-medium transition-[background-color,border-color,color] duration-150",
              "has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50",
              o.value === value
                ? "border-transparent bg-foreground text-background"
                : cn(
                    "bg-card hover:border-foreground/25 hover:text-foreground",
                    o.muted ? "text-muted-foreground/70" : "text-muted-foreground",
                  ),
            )}
          >
            <input
              type="radio"
              name={name}
              className="sr-only"
              checked={o.value === value}
              onChange={() => onChange(o.value)}
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function MovesExplorer({ data }: { data: LearnsetData }) {
  const { games, learnsets, meta } = data;
  const uid = useId();
  const urlGame = useSyncExternalStore(subscribe, readGameParam, () => null);
  const [picked, setPicked] = useState<string | null>(null);
  const [pickedMethod, setPickedMethod] = useState<LearnMethod>("level-up");

  const byName = useMemo(() => new Map(games.map((g) => [g.name, g])), [games]);
  const game =
    byName.get(picked ?? "") ?? byName.get(urlGame ?? "") ?? preferred(games);

  if (!game) {
    return <p className="text-muted-foreground">No move data recorded for this Pokémon.</p>;
  }

  const gens = [...new Set(games.map((g) => g.gen))].sort((a, b) => a - b);
  const gamesInGen = games
    .filter((g) => g.gen === game.gen)
    .sort((a, b) => Number(a.side) - Number(b.side) || a.order - b.order);
  const set = learnsets[game.name] ?? {};
  const methods = METHODS.filter((m) => set[m.id]?.length);
  const method = set[pickedMethod]?.length ? pickedMethod : (methods[0]?.id ?? "level-up");
  const rows = set[method] ?? [];

  const selectGame = (name: string) => {
    setPicked(name);
    // Shareable: /pokemon/charizard?game=red-blue#moves
    const url = new URL(window.location.href);
    url.searchParams.set("game", name);
    url.hash = "moves";
    window.history.replaceState(null, "", url);
  };

  return (
    <div className="surface overflow-hidden">
      <div className="space-y-4 border-b p-4 md:p-6">
        <RadioPills
          name={`${uid}-gen`}
          legend="Generation"
          value={game.gen}
          onChange={(gen) => selectGame(preferred(games.filter((g) => g.gen === gen)).name)}
          options={gens.map((g) => ({
            value: g,
            label: <span className="font-mono">{ROMAN[g]}</span>,
            title: `Generation ${ROMAN[g]}`,
          }))}
        />
        <RadioPills
          name={`${uid}-game`}
          legend="Game"
          value={game.name}
          onChange={selectGame}
          options={gamesInGen.map((g) => ({
            value: g.name,
            label: g.label,
            muted: g.side,
          }))}
        />
        <div role="tablist" aria-label="How the move is learned" className="flex flex-wrap gap-1 border-t pt-4">
          {methods.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={m.id === method}
              aria-controls="moves-table"
              onClick={() => setPickedMethod(m.id)}
              className={cn(
                "inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50",
                m.id === method
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )}
            >
              {m.label}
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {set[m.id]!.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table id="moves-table" role="tabpanel" className="w-full text-sm">
          <caption className="sr-only">
            {METHODS.find((m) => m.id === method)?.label} moves in {game.label}
          </caption>
          <thead className="text-left text-xs text-muted-foreground">
            <tr className="border-b">
              {method === "level-up" && <th scope="col" className="w-16 px-4 py-2.5 font-medium md:pl-6">Lv</th>}
              <th scope="col" className="px-4 py-2.5 font-medium md:first:pl-6">Move</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Type</th>
              <th scope="col" className="hidden px-4 py-2.5 font-medium sm:table-cell">Category</th>
              <th scope="col" className="px-4 py-2.5 text-right font-medium">Power</th>
              <th scope="col" className="hidden px-4 py-2.5 text-right font-medium sm:table-cell">Acc.</th>
              <th scope="col" className="hidden px-4 py-2.5 text-right font-medium sm:table-cell md:pr-6">PP</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map(([name, level]) => {
              const [type, category, power, accuracy, pp] = meta[name] ?? ["normal", "status", null, null, null];
              return (
                <tr key={`${name}-${level}`} className="transition-colors hover:bg-accent/50">
                  {method === "level-up" && (
                    <td className="px-4 py-2.5 font-mono text-muted-foreground tabular-nums md:pl-6">
                      {level === 0 ? "Evo" : level}
                    </td>
                  )}
                  <td className="px-4 py-2.5 md:first:pl-6">
                    <Link
                      href={`/moves/${name}`}
                      className="font-medium underline-offset-4 outline-none hover:underline focus-visible:underline"
                    >
                      {titleCase(name)}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5">
                    <TypeChip type={type} />
                  </td>
                  <td className="hidden px-4 py-2.5 text-muted-foreground capitalize sm:table-cell">
                    {category}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono tabular-nums">{power ?? "—"}</td>
                  <td className="hidden px-4 py-2.5 text-right font-mono tabular-nums sm:table-cell">
                    {accuracy ? `${accuracy}%` : "—"}
                  </td>
                  <td className="hidden px-4 py-2.5 text-right font-mono tabular-nums sm:table-cell md:pr-6">
                    {pp ?? "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
