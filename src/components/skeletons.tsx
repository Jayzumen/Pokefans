import { cn } from "@/lib/utils";
import { Container } from "./layout";

/** Pulse block used by every loading state. */
export function Bone({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-md bg-muted motion-reduce:animate-none", className)}
    />
  );
}

export function HeaderSkeleton() {
  return (
    <div className="border-b">
      <Container className="space-y-4 py-12 md:py-16">
        <Bone className="h-3 w-24" />
        <Bone className="h-12 w-72 max-w-full" />
        <Bone className="h-5 w-[32rem] max-w-full" />
      </Container>
    </div>
  );
}

export function GridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] sm:gap-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="surface p-2">
          <Bone className="aspect-square w-full rounded-[calc(var(--radius)-6px)]" />
          <div className="space-y-2 px-2 pt-3 pb-2">
            <Bone className="h-4 w-2/3" />
            <Bone className="h-5 w-1/2 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Header + grid: the shape of every list page. */
export function ListPageSkeleton() {
  return (
    <main aria-busy="true" aria-label="Loading">
      <HeaderSkeleton />
      <Container className="py-10">
        <GridSkeleton />
      </Container>
    </main>
  );
}

/** Shape of the Pokémon detail page. */
export function DetailSkeleton() {
  return (
    <main aria-busy="true" aria-label="Loading">
      <Container className="py-8 md:py-12">
        <div className="surface grid gap-8 p-6 md:grid-cols-2 md:p-10">
          <div className="space-y-4">
            <Bone className="h-4 w-16" />
            <Bone className="h-12 w-64 max-w-full" />
            <Bone className="h-5 w-40" />
            <Bone className="h-8 w-48 rounded-full" />
          </div>
          <Bone className="aspect-square w-full max-w-sm justify-self-center rounded-full" />
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Bone className="h-72 w-full rounded-[var(--radius)]" />
          <Bone className="h-72 w-full rounded-[var(--radius)]" />
        </div>
      </Container>
    </main>
  );
}
