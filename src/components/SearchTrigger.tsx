"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Search } from "lucide-react";

// The palette and its search data load on first use, not with every page.
const loadPalette = () => import("./CommandPalette");
const CommandPalette = dynamic(loadPalette, { ssr: false });

/** Navbar button + global ⌘K / Ctrl+K / "/" shortcut for the search palette. */
export function SearchTrigger() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing =
        e.target instanceof HTMLElement &&
        (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName));
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setMounted(true);
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setMounted(true);
          setOpen(true);
        }}
        // Start downloading the palette as soon as the user shows intent.
        onPointerEnter={() => void loadPalette()}
        onFocus={() => void loadPalette()}
        aria-keyshortcuts="Control+K Meta+K"
        className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full border bg-card px-2.5 text-sm text-muted-foreground outline-none transition-colors hover:border-foreground/25 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 xl:w-44 xl:px-3"
      >
        <Search aria-hidden className="size-4" />
        {/* The accessible name is the visible text (screen-reader-only on small screens). */}
        <span className="sr-only xl:not-sr-only">Search…</span>
        <kbd aria-hidden className="ml-auto hidden rounded border px-1.5 font-mono text-[10px] xl:inline">
          Ctrl K
        </kbd>
      </button>
      {mounted && <CommandPalette open={open} onOpenChange={setOpen} />}
    </>
  );
}
