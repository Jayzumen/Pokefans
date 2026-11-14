"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="relative grid min-h-[70vh] place-items-center overflow-hidden px-4 py-16 text-center">
      <div aria-hidden className="dot-grid absolute inset-0" />
      <div className="relative flex flex-col items-center gap-4">
        <h1 className="text-4xl font-semibold tracking-[-0.035em]">
          Something went wrong
        </h1>
        <p className="max-w-md text-muted-foreground">
          The Pokémon data couldn&apos;t be loaded right now. This is usually a
          temporary problem with the data source.
        </p>
        <div className="mt-2 flex gap-2">
          <Button onClick={reset} className="rounded-full">
            <RotateCcw />
            Try again
          </Button>
          <Button variant="outline" asChild className="rounded-full">
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
