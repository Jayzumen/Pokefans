import { expect, test } from "@playwright/test";

test("Pokédex filters are shareable through the URL", async ({ page }) => {
  await page.goto("/pokedex?type=fire,flying&gen=1");
  const cards = page.getByRole("main").getByRole("link", { name: /charizard|moltres/i });
  await expect(cards).toHaveCount(2);
  await expect(page.getByText("2 Pokémon")).toBeVisible();

  await page.getByRole("searchbox", { name: /search for a pokémon/i }).fill("molt");
  await expect(page).toHaveURL(/q=molt/);
  await expect(page.getByText("1 Pokémon")).toBeVisible();
});

test("home page search leads to Pokédex results", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("searchbox", { name: /search pokémon/i }).fill("eevee");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page).toHaveURL(/\/pokedex\?q=eevee/);
  await expect(page.getByRole("main").getByRole("link", { name: /eevee/i })).toBeVisible();
});

test("command palette jumps to a move", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard shortcut is a desktop feature");
  await page.goto("/");
  await page.keyboard.press("Control+k");
  const input = page.getByRole("combobox");
  await expect(input).toBeFocused();
  await input.fill("thunderbolt");
  await expect(page.getByRole("option").first()).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/moves\/thunderbolt$/);
});

test("moves explorer switches generation and game", async ({ page }) => {
  await page.goto("/pokemon/charizard");
  const moves = page.locator("#moves");
  await moves.scrollIntoViewIfNeeded();

  await moves.getByText("I", { exact: true }).click();
  await expect(page).toHaveURL(/game=yellow/);
  await expect(moves.getByRole("radio", { name: "Yellow" })).toBeChecked();
  await expect(moves.getByRole("tabpanel")).toContainText("Flamethrower");

  await moves.getByText("Red / Blue", { exact: true }).click();
  await expect(page).toHaveURL(/game=red-blue/);

  // The selection survives a reload.
  await page.reload();
  await expect(page.locator("#moves").getByRole("radio", { name: "Red / Blue" })).toBeChecked();
});

test("detail page shows matchups and evolution", async ({ page }) => {
  await page.goto("/pokemon/charizard");
  const matchups = page.locator("#matchups");
  await expect(matchups).toContainText("×4");
  await expect(matchups.getByRole("link", { name: /rock/i })).toBeVisible();
  await expect(page.locator("#evolution").getByRole("link", { name: /charmander/i })).toBeVisible();
});

test("clicking a card opens the detail page", async ({ page }) => {
  await page.goto("/generations/1");
  await page.getByRole("link", { name: /pikachu/i }).first().click();
  await expect(page).toHaveURL(/\/pokemon\/pikachu$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/pikachu/i);
  await expect(page.locator("#overview")).toBeVisible();
});

test("theme switch toggles dark mode and remembers it", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/types");
  const toggle = page.getByRole("switch", { name: "Dark mode" });
  await expect(toggle).toHaveAttribute("aria-checked", "false");
  await toggle.click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(page.getByRole("switch", { name: "Dark mode" })).toHaveAttribute("aria-checked", "true");
});

test("type chart highlights a matchup", async ({ page }) => {
  await page.goto("/types");
  await expect(page.getByLabel("water against fire: ×2")).toHaveText("2");
  await expect(page.getByRole("cell")).toHaveCount(324);
});

test("login shows separate sign-in and sign-up forms", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("tab", { name: "Sign in" })).toHaveAttribute("aria-selected", "true");
  await page.getByRole("tab", { name: "Create account" }).click();
  await expect(page.getByLabel("Username")).toBeVisible();
  await expect(page.getByLabel("Password")).toHaveAttribute("minlength", "8");
});

test("mobile menu opens and navigates", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only");
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("dialog").getByRole("link", { name: "Types" }).click();
  await expect(page).toHaveURL(/\/types$/);
});

test("pages never scroll sideways on phones", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only");
  for (const path of ["/", "/pokedex", "/types", "/pokemon/charizard", "/moves"]) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});
