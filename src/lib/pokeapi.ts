import { notFound } from "next/navigation";

const BASE = "https://pokeapi.co/api/v2";
const WEEK = 60 * 60 * 24 * 7;

/** Highest national dex number with official artwork (Gen 9 incl. DLC). */
export const MAX_POKEMON_ID = 1025;

/** Waits before retry n (1-based): 400 ms, 1.2 s, 3.6 s … */
export const retryDelay = (attempt: number) => 400 * 3 ** (attempt - 1);
const MAX_ATTEMPTS = 4;

/** Rate limiting and server errors are worth retrying; other statuses aren't. */
const isRetryableStatus = (status: number) => status === 429 || status >= 500;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Typed, cached PokeAPI fetcher for server components.
 * - Accepts a path ("pokemon/25") or a full PokeAPI URL (from `results[].url`).
 * - Calls `notFound()` on 404 so routes render the 404 page instead of crashing.
 * - Retries dropped connections (e.g. ECONNRESET), 429 and 5xx responses with
 *   exponential backoff, so one hiccup doesn't fail a build or a page.
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

  for (let attempt = 1; ; attempt++) {
    let res: Response;
    try {
      res = await fetch(url, { next: { revalidate, tags: ["pokeapi"] } });
    } catch (error) {
      // Network-level failure: connection reset, DNS, timeout…
      if (attempt >= MAX_ATTEMPTS) throw error;
      await sleep(retryDelay(attempt));
      continue;
    }
    if (res.status === 404) notFound();
    if (res.ok) return (await res.json()) as T;
    if (!isRetryableStatus(res.status) || attempt >= MAX_ATTEMPTS) {
      throw new Error(`PokeAPI responded ${res.status} for ${url}`);
    }
    await sleep(retryDelay(attempt));
  }
}

/**
 * Like `pokeapi`, but resolves to `fallback` instead of throwing. For
 * optional extras (e.g. random featured entries) that must never break a
 * page or a build. A 404 still renders the 404 page.
 */
export async function pokeapiOr<T>(pathOrUrl: string, fallback: T): Promise<T> {
  try {
    return await pokeapi<T>(pathOrUrl);
  } catch (error) {
    if (String((error as { digest?: string })?.digest ?? "").includes("404")) throw error;
    console.warn(`PokeAPI unavailable for ${pathOrUrl}, using fallback`, error);
    return fallback;
  }
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
