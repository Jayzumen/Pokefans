import { afterEach, describe, expect, it, vi } from "vitest";
import { mapLimit, pokeapi, randomIds, slugOrNotFound } from "./pokeapi";

/** next/navigation's notFound() throws an error tagged with this digest. */
const isNotFound = (e: unknown) =>
  String((e as { digest?: string })?.digest ?? "").includes("404");

function catchError(fn: () => unknown) {
  try {
    fn();
  } catch (e) {
    return e;
  }
  throw new Error("expected function to throw");
}

describe("slugOrNotFound", () => {
  it("accepts and normalises PokeAPI slugs and numbers", () => {
    expect(slugOrNotFound("pikachu")).toBe("pikachu");
    expect(slugOrNotFound("Mr-Mime")).toBe("mr-mime");
    expect(slugOrNotFound("  25 ")).toBe("25");
    expect(slugOrNotFound("charizard%2Dmega%2Dx")).toBe("charizard-mega-x");
  });

  it.each([
    "../berry/1",
    "pikachu?x=1",
    "pika chu",
    "a".repeat(61),
    "",
    "%E0%A4%A", // malformed percent-encoding
    "<script>",
  ])("rejects %j with a 404", (raw) => {
    expect(isNotFound(catchError(() => slugOrNotFound(raw)))).toBe(true);
  });
});

describe("randomIds", () => {
  it("returns unique ids within [1, max]", () => {
    for (let run = 0; run < 50; run++) {
      const ids = randomIds(6, 10);
      expect(new Set(ids).size).toBe(6);
      for (const id of ids) {
        expect(id).toBeGreaterThanOrEqual(1);
        expect(id).toBeLessThanOrEqual(10);
      }
    }
  });

  it("never asks for more ids than exist", () => {
    expect(randomIds(10, 3).sort()).toEqual([1, 2, 3]);
  });
});

describe("mapLimit", () => {
  it("keeps the input order and never exceeds the limit", async () => {
    let running = 0;
    let peak = 0;
    const result = await mapLimit([5, 1, 4, 2, 3], 2, async (n) => {
      running++;
      peak = Math.max(peak, running);
      await new Promise((r) => setTimeout(r, n));
      running--;
      return n * 10;
    });
    expect(result).toEqual([50, 10, 40, 20, 30]);
    expect(peak).toBeLessThanOrEqual(2);
  });

  it("handles an empty list", async () => {
    expect(await mapLimit([], 4, async (x) => x)).toEqual([]);
  });
});

describe("pokeapi", () => {
  afterEach(() => vi.unstubAllGlobals());

  const stubFetch = (status: number, body: unknown = {}) => {
    const fetchMock = vi.fn(
      async (_url: string, _init?: RequestInit) =>
        new Response(JSON.stringify(body), { status }),
    );
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
  };

  it("builds the URL from a path and caches for a week by default", async () => {
    const fetchMock = stubFetch(200, { name: "pikachu" });
    await expect(pokeapi("pokemon/25")).resolves.toEqual({ name: "pikachu" });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://pokeapi.co/api/v2/pokemon/25",
      expect.objectContaining({
        next: expect.objectContaining({ revalidate: 60 * 60 * 24 * 7 }),
      }),
    );
  });

  it("accepts full PokeAPI URLs", async () => {
    const fetchMock = stubFetch(200);
    await pokeapi("https://pokeapi.co/api/v2/pokemon-species/25/");
    expect(fetchMock.mock.calls[0][0]).toBe("https://pokeapi.co/api/v2/pokemon-species/25/");
  });

  it("refuses to fetch anything that isn't PokeAPI", async () => {
    stubFetch(200);
    await expect(pokeapi("https://evil.example/api/v2/x")).rejects.toThrow(/non-PokeAPI/);
  });

  it("turns a 404 into notFound()", async () => {
    stubFetch(404);
    const error = await pokeapi("pokemon/missingno").catch((e) => e);
    expect(isNotFound(error)).toBe(true);
  });

  it("throws on other errors so the error page shows", async () => {
    stubFetch(503);
    await expect(pokeapi("pokemon/1")).rejects.toThrow(/503/);
  });
});
