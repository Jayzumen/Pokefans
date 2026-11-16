import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mapLimit, pokeapi, pokeapiOr, randomIds, retryDelay, slugOrNotFound } from "./pokeapi";

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

  describe("retries", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    /** Replies in order; each item is a status code or "reset" (network error). */
    const stubSequence = (...replies: (number | "reset")[]) => {
      const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => {
        const next = replies.shift() ?? 200;
        if (next === "reset") throw new TypeError("fetch failed", { cause: { code: "ECONNRESET" } });
        return new Response(JSON.stringify({ ok: next }), { status: next });
      });
      vi.stubGlobal("fetch", fetchMock);
      return fetchMock;
    };

    /** Run the request while letting the backoff timers elapse instantly. */
    const settle = async <T,>(promise: Promise<T>) => {
      const result = promise.then(
        (value) => ({ value }),
        (error: unknown) => ({ error }),
      );
      await vi.runAllTimersAsync();
      return result;
    };

    it("recovers from a dropped connection (the ECONNRESET build failure)", async () => {
      const fetchMock = stubSequence("reset", 200);
      expect(await settle(pokeapi("type/fairy"))).toEqual({ value: { ok: 200 } });
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("retries rate limiting and server errors with growing delays", async () => {
      const fetchMock = stubSequence(429, 502, 503, 200);
      expect(await settle(pokeapi("move/1"))).toEqual({ value: { ok: 200 } });
      expect(fetchMock).toHaveBeenCalledTimes(4);
      expect([1, 2, 3].map(retryDelay)).toEqual([400, 1200, 3600]);
    });

    it("gives up after four attempts", async () => {
      const fetchMock = stubSequence(503, 503, 503, 503);
      const result = await settle(pokeapi("pokemon/1"));
      expect(String((result as { error: unknown }).error)).toMatch(/503/);
      expect(fetchMock).toHaveBeenCalledTimes(4);
    });

    it("rethrows the network error after the last attempt", async () => {
      stubSequence("reset", "reset", "reset", "reset");
      const result = await settle(pokeapi("pokemon/1"));
      expect(String((result as { error: unknown }).error)).toMatch(/fetch failed/);
    });

    it("does not retry client errors or 404s", async () => {
      let fetchMock = stubSequence(400);
      await settle(pokeapi("pokemon/1"));
      expect(fetchMock).toHaveBeenCalledTimes(1);

      fetchMock = stubSequence(404);
      const result = await settle(pokeapi("pokemon/missingno"));
      expect(isNotFound((result as { error: unknown }).error)).toBe(true);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("pokeapiOr falls back instead of failing, but keeps 404s", async () => {
      vi.spyOn(console, "warn").mockImplementation(() => {});
      stubSequence(503, 503, 503, 503);
      expect(await settle(pokeapiOr("move/1", null))).toEqual({ value: null });

      stubSequence(404);
      const result = await settle(pokeapiOr("move/missingno", null));
      expect(isNotFound((result as { error: unknown }).error)).toBe(true);
    });
  });
});
