import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { artworkUrl, formatDexNumber } from "@/lib/pokemon";
import type { IndexPokemon } from "@/lib/pokemon-index";
import { typeVars } from "@/lib/types";
import { Container } from "../layout";
import { TypeChips } from "../TypeChip";
import { Button } from "../ui/button";

export default function Hero({
  star,
  stats,
}: {
  star: IndexPokemon;
  stats: { label: string; value: number }[];
}) {
  return (
    <section
      className="relative -mt-20 overflow-hidden border-b pt-20"
      style={typeVars(star.types)}
    >
      {/* Background: dot grid + a glow in the featured Pokémon's type color */}
      <div aria-hidden className="dot-grid absolute inset-0" />
      <div
        aria-hidden
        className="absolute top-1/2 right-[-10%] size-[42rem] -translate-y-1/2 rounded-full opacity-40 blur-3xl dark:opacity-25"
        style={{
          background:
            "radial-gradient(circle, var(--t) 0%, color-mix(in oklch, var(--t2) 60%, transparent) 45%, transparent 70%)",
        }}
      />

      <Container className="relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <p className="eyebrow fade-up inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1.5 text-muted-foreground backdrop-blur">
            <span className="size-1.5 rounded-full bg-primary" />
            Pokémon of the day
          </p>
          <h1 className="fade-up mt-6 text-[clamp(2.75rem,6vw+1rem,5.5rem)] leading-[0.95] font-semibold tracking-[-0.045em]">
            Every Pokémon.
            <br />
            <span className="text-muted-foreground">One field guide.</span>
          </h1>
          <p className="fade-up mt-6 max-w-xl text-lg text-muted-foreground">
            Stats, types, evolutions, moves and abilities for all{" "}
            {stats[0]?.value.toLocaleString("en-US")} Pokémon. Fast, free, and
            built for fans.
          </p>

          <form
            action="/pokedex"
            role="search"
            className="fade-up relative mt-8 max-w-xl"
          >
            <label htmlFor="hero-search" className="sr-only">
              Search Pokémon
            </label>
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-muted-foreground"
            />
            <input
              id="hero-search"
              name="q"
              type="search"
              autoComplete="off"
              placeholder="Search Pikachu, char, #25…"
              className="h-14 w-full rounded-full border bg-card pr-36 pl-13 text-base shadow-sm outline-none transition-[box-shadow,border-color] placeholder:text-muted-foreground focus:border-ring focus:ring-4 focus:ring-ring/20 [&::-webkit-search-cancel-button]:hidden"
            />
            <Button
              type="submit"
              className="absolute top-1/2 right-2 h-10 -translate-y-1/2 rounded-full px-5"
            >
              Search
            </Button>
          </form>

          <div className="fade-up mt-5 flex flex-wrap gap-3">
            <Button asChild variant="outline" className="group h-10 rounded-full px-5">
              <Link href="/pokedex">
                Browse all Pokémon
                <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild variant="ghost" className="h-10 rounded-full px-5">
              <Link href="/teams">See community teams</Link>
            </Button>
          </div>
        </div>

        {/* Featured Pokémon */}
        <Link
          href={`/pokemon/${star.name}`}
          className="group relative mx-auto block w-full max-w-md outline-none"
          aria-label={`${star.name}, Pokémon of the day`}
        >
          <Image
            src={artworkUrl(star.id)}
            alt=""
            width={480}
            height={480}
            priority
            sizes="(min-width: 1024px) 28rem, 80vw"
            className="relative mx-auto aspect-square w-full object-contain drop-shadow-[0_24px_32px_oklch(0_0_0/0.25)] transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.02] motion-reduce:transition-none"
          />
          <div className="surface absolute right-0 bottom-2 left-0 mx-auto flex w-fit items-center gap-4 px-4 py-3 backdrop-blur group-hover:shadow-md group-focus-visible:ring-[3px] group-focus-visible:ring-ring/50">
            <div>
              <p className="font-mono text-xs text-muted-foreground tabular-nums">
                {formatDexNumber(star.id)}
              </p>
              <p className="text-lg font-semibold capitalize leading-tight">
                {star.name.replace(/-/g, " ")}
              </p>
            </div>
            <TypeChips types={star.types} link={false} />
            <ArrowRight className="size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
        </Link>
      </Container>

      {/* Stats strip */}
      <Container className="relative">
        <dl className="grid grid-cols-2 border-t md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`py-6 ${i % 2 ? "pl-6" : ""} md:pl-6 md:first:pl-0 ${i ? "md:border-l" : ""} ${i % 2 ? "border-l" : ""}`}
            >
              <dt className="eyebrow text-muted-foreground">{s.label}</dt>
              <dd className="mt-1 font-mono text-3xl font-medium tracking-tight tabular-nums">
                {s.value.toLocaleString("en-US")}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
