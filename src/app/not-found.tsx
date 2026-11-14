import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="text-4xl font-bold">Who&apos;s that Pokémon?</h1>
      <p className="max-w-md text-muted-foreground">
        We couldn&apos;t find what you were looking for. Check the spelling or
        head back to the Pokédex.
      </p>
      <Button asChild>
        <Link href="/pokedex">Open Pokédex</Link>
      </Button>
    </main>
  );
}
