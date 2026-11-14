import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  "/",
  "/pokedex",
  "/generations/1",
  "/types",
  "/types/fire",
  "/moves",
  "/moves/thunderbolt",
  "/abilities/levitate",
  "/pokemon/charizard",
  "/teams",
  "/login",
];

for (const theme of ["light", "dark"] as const) {
  test.describe(`accessibility (${theme})`, () => {
    test.use({ colorScheme: theme });

    for (const path of pages) {
      test(path, async ({ page }) => {
        await page.goto(path);
        // Let streamed sections and entrance animations settle.
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(800);

        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .analyze();

        const serious = results.violations.filter((v) =>
          ["serious", "critical"].includes(v.impact ?? ""),
        );
        const report = serious
          .map((v) => `${v.id}: ${v.help}\n  ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join("\n  ")}`)
          .join("\n");
        expect(serious, report).toEqual([]);
      });
    }
  });
}
