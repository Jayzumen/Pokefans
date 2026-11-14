import { expect, test } from "@playwright/test";

const routes: [path: string, heading: RegExp][] = [
  ["/", /every pokémon/i],
  ["/pokedex", /pokédex/i],
  ["/generations/1", /kanto/i],
  ["/types", /^types$/i],
  ["/types/fire", /fire/i],
  ["/moves", /^moves$/i],
  ["/moves/thunderbolt", /thunderbolt/i],
  ["/abilities", /^abilities$/i],
  ["/abilities/levitate", /levitate/i],
  ["/pokemon/charizard", /charizard/i],
  ["/pokemon/25", /pikachu/i],
  ["/pokemon/charizard-mega-x", /charizard/i],
  ["/teams", /^teams$/i],
  ["/login", /welcome/i],
];

test.describe("every page renders", () => {
  for (const [path, heading] of routes) {
    test(path, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      expect(errors, errors.join("\n")).toEqual([]);
    });
  }
});

test("unknown pages return 404 with a helpful page", async ({ page }) => {
  for (const path of ["/does-not-exist", "/pokemon/missingno", "/generations/10", "/types/stellar"]) {
    const res = await page.goto(path);
    expect(res?.status(), path).toBe(404);
    await expect(page.getByRole("heading", { name: /who's that pokémon/i })).toBeVisible();
  }
});

test("malicious route parameters are rejected", async ({ page }) => {
  const res = await page.goto("/pokemon/..%2F..%2Fberry%2F1");
  expect(res?.status()).toBe(404);
});

test("security headers are set", async ({ request }) => {
  const res = await request.get("/");
  const h = res.headers();
  expect(h["content-security-policy"]).toContain("default-src 'self'");
  expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(h["content-security-policy"]).not.toContain("unsafe-eval");
  expect(h["strict-transport-security"]).toContain("max-age=");
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["x-frame-options"]).toBe("DENY");
  expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(h["x-powered-by"]).toBeUndefined();
});

test("SEO files are served", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  const xml = await sitemap.text();
  expect(xml).toContain("/pokemon/pikachu</loc>");
  expect(xml).toContain("/types/dragon</loc>");

  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toMatch(/Sitemap: .*\/sitemap\.xml/);

  const manifest = await (await request.get("/manifest.webmanifest")).json();
  expect(manifest.short_name).toBe("Pokéfans");

  const og = await request.get("/pokemon/charizard/opengraph-image");
  expect(og.headers()["content-type"]).toBe("image/png");
});
