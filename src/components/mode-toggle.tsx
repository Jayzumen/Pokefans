"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/**
 * Light/dark switch. Starts from the resolved theme (so "system" users see
 * the right state) and stores an explicit choice once clicked.
 * Visual state comes from the `.dark` class, so it renders correctly on the
 * server; only the ARIA state waits for mount to avoid hydration mismatches.
 */
const noopSubscribe = () => () => {};

export function ModeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  // false during SSR/hydration, true on the client afterwards.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={mounted ? isDark : undefined}
      aria-label="Dark mode"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "group relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border border-border bg-muted p-0.5",
        "transition-colors duration-300 hover:border-foreground/20",
        "dark:border-white/10 dark:bg-slate-800 dark:hover:border-white/25",
        "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className,
      )}
    >
      {/* Track icons */}
      <Sun
        aria-hidden
        className="absolute left-2 size-3.5 text-amber-500/0 transition-colors duration-300 dark:text-amber-300/60"
      />
      <Moon
        aria-hidden
        className="absolute right-2 size-3.5 text-slate-500/70 transition-colors duration-300 dark:text-slate-300/0"
      />

      {/* Thumb */}
      <span
        aria-hidden
        className={cn(
          "relative z-10 flex size-6 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5",
          "transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none",
          "group-active:scale-90 dark:translate-x-6 dark:bg-slate-950 dark:ring-white/10",
        )}
      >
        <Sun className="absolute size-3.5 text-amber-500 transition-all duration-300 dark:rotate-90 dark:scale-0 dark:opacity-0" />
        <Moon className="absolute size-3.5 -rotate-90 scale-0 text-sky-300 opacity-0 transition-all duration-300 dark:rotate-0 dark:scale-100 dark:opacity-100" />
      </span>
    </button>
  );
}
