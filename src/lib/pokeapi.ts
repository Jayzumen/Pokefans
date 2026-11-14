import { notFound } from "next/navigation";

const BASE = "https://pokeapi.co/api/v2";
const WEEK = 60 * 60 * 24 * 7;

/** Highest national dex number with official artwork (Gen 9 incl. DLC). */
export const MAX_POKEMON_ID = 1025;

/**
 * Typed, cached PokeAPI fetcher for server components.
 * - Accepts a path ("pokemon/25") or a full PokeAPI URL (from `results[].url`).
 * - Calls `notFound()` on 404 so routes render the 404 page instead of crashing.
 * - Caches for a week by default: PokeAPI data is effectively static.
 */
export async function pokeapi<T>(
  pathOrUrl: string,
  { revalidate = WEEK }: { revalidate?: number } = {},
): Promise<T> {
  const url = pathOrUrl.startsWith("https://")
    ? pathOrUrl
    : `${BASE}/${pathOrUrl.replace(/^\/+/, "")}`;

  if (!url.startsWith(`${BASE}/`)) {
    throw new Error(`Refusing to fetch non-PokeAPI URL: ${url}`);
  }

  const res = await fetch(url, { next: { revalidate, tags: ["pokeapi"] } });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`PokeAPI responded ${res.status} for ${url}`);
  return (await res.json()) as T;
}

/** Run async jobs with a concurrency cap: fast, but polite to PokeAPI. */
export async function mapLimit<T, R>(
  items: readonly T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const out = new Array<R>(items.length);
  let next = 0;
  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i], i);
      }
    },
  );
  await Promise.all(workers);
  return out;
}

/** `count` unique random integers in [1, max]. */
export function randomIds(count: number, max: number): number[] {
  const ids = new Set<number>();
  while (ids.size < Math.min(count, max)) {
    ids.add(1 + Math.floor(Math.random() * max));
  }
  return [...ids];
}

const SLUG = /^[a-z0-9-]{1,60}$/;

/**
 * Normalise and validate a route param before it is used in a fetch URL.
 * Calls `notFound()` for anything that isn't a plain PokeAPI slug or id.
 */
export function slugOrNotFound(raw: string): string {
  let value: string;
  try {
    value = decodeURIComponent(raw).trim().toLowerCase();
  } catch {
    notFound();
  }
  if (!SLUG.test(value)) notFound();
  return value;
}
