"use client";

import { useState } from "react";
import { formatMultiplier, multiplier } from "@/lib/type-chart";
import { TYPE_NAMES, typeVars } from "@/lib/types";
import { cn } from "@/lib/utils";

const CELL: Record<number, string> = {
  2: "bg-emerald-500/85 text-white",
  0.5: "bg-rose-500/80 text-white",
  0: "bg-foreground text-background",
};

function TypeIcon({ type, className }: { type: string; className?: string }) {
  return (
    <span
      className={cn("grid place-items-center rounded-full p-1", className)}
      style={{ ...typeVars([type]), background: "var(--t)" }}
      title={type}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- tiny static SVG */}
      <img src={`/typeImages/${type}.svg`} alt="" className="size-full" />
    </span>
  );
}

/**
 * 18×18 attack chart. Rows attack, columns defend. Hovering or focusing a
 * cell highlights its row and column.
 */
export default function TypeChart() {
  const [active, setActive] = useState<{ r: number; c: number } | null>(null);

  return (
    // contain-paint: keeps the wide table from widening the page on phones.
    <div className="surface overflow-x-auto p-4 contain-paint md:p-6">
      <table className="mx-auto border-separate border-spacing-0.5 text-center font-mono text-xs tabular-nums">
        <caption className="mb-4 text-left font-sans text-sm text-muted-foreground">
          Rows are the <strong className="text-foreground">attacking</strong>{" "}
          move type, columns the <strong className="text-foreground">defending</strong>{" "}
          Pokémon type.{" "}
          <span className="inline-flex items-center gap-1">
            <span className="size-3 rounded-sm bg-emerald-500/85" /> ×2
          </span>{" "}
          <span className="inline-flex items-center gap-1">
            <span className="size-3 rounded-sm bg-rose-500/80" /> ×½
          </span>{" "}
          <span className="inline-flex items-center gap-1">
            <span className="size-3 rounded-sm bg-foreground" /> ×0
          </span>
        </caption>
        <thead>
          <tr>
            <th scope="col">
              <span className="sr-only">Attacking type</span>
            </th>
            {TYPE_NAMES.map((t, c) => (
              <th key={t} scope="col" className="p-0">
                <TypeIcon
                  type={t}
                  className={cn(
                    "mx-auto size-7 transition-opacity",
                    active && active.c !== c && "opacity-40",
                  )}
                />
                <span className="sr-only">{t}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody onMouseLeave={() => setActive(null)}>
          {TYPE_NAMES.map((attacker, r) => (
            <tr key={attacker}>
              <th scope="row" className="pr-1">
                <span
                  className={cn(
                    "flex items-center justify-end gap-2 font-sans text-xs font-medium capitalize transition-opacity",
                    active && active.r !== r && "opacity-40",
                  )}
                >
                  <span className="hidden sm:inline">{attacker}</span>
                  <TypeIcon type={attacker} className="size-6" />
                </span>
              </th>
              {TYPE_NAMES.map((defender, c) => {
                const m = multiplier(attacker, defender);
                const inLine = active && (active.r === r || active.c === c);
                return (
                  <td
                    key={defender}
                    tabIndex={0}
                    onMouseEnter={() => setActive({ r, c })}
                    onFocus={() => setActive({ r, c })}
                    onBlur={() => setActive(null)}
                    aria-label={`${attacker} against ${defender}: ×${formatMultiplier(m)}`}
                    className={cn(
                      "size-8 rounded-md outline-none transition-[opacity,box-shadow] duration-150 focus-visible:ring-2 focus-visible:ring-ring",
                      CELL[m] ?? "bg-muted/60 text-transparent",
                      active && !inLine && "opacity-35",
                      active?.r === r && active?.c === c && "ring-2 ring-foreground",
                    )}
                  >
                    {m === 1 ? "" : formatMultiplier(m)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
