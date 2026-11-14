import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PokeballIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <main className="relative grid min-h-[70vh] place-items-center overflow-hidden px-4 py-16 text-center">
      <div aria-hidden className="dot-grid absolute inset-0" />
      <div className="relative flex flex-col items-center gap-4">
        <PokeballIcon
          aria-hidden
          className="size-16 text-muted-foreground/40 motion-safe:animate-[spin_6s_linear_infinite]"
        />
        <p className="font-mono text-sm text-muted-foreground">404</p>
        <h1 className="text-4xl font-semibold tracking-[-0.035em] md:text-5xl">
          Who&apos;s that Pokémon?
        </h1>
        <p className="max-w-md text-muted-foreground">
          We couldn&apos;t find what you were looking for. Check the spelling or
          head back to the Pokédex.
        </p>
        <div className="mt-2 flex gap-2">
          <Button asChild className="rounded-full">
            <Link href="/pokedex">Open Pokédex</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
