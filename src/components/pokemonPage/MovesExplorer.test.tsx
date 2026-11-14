import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { buildLearnsets } from "@/lib/learnset";
import type { Move } from "@/types/pokemonTypes";
import MovesExplorer from "./MovesExplorer";

function move(name: string, details: [string, string, number][]): Move {
  return {
    move: { name, url: "" },
    version_group_details: details.map(([game, method, level]) => ({
      level_learned_at: level,
      move_learn_method: { name: method, url: "" },
      version_group: { name: game, url: "" },
    })),
  };
}

// A small Charizard-like learnset across three generations.
const data = buildLearnsets([
  move("ember", [
    ["red-blue", "level-up", 1],
    ["yellow", "level-up", 1],
    ["red-green-japan", "level-up", 1],
    ["scarlet-violet", "level-up", 1],
  ]),
  move("slash", [
    ["red-blue", "level-up", 36],
    ["yellow", "level-up", 36],
  ]),
  move("flamethrower", [
    ["yellow", "level-up", 46],
    ["yellow", "machine", 0],
    ["scarlet-violet", "level-up", 30],
  ]),
  move("air-slash", [["scarlet-violet", "level-up", 0]]),
  move("dragon-dance", [["scarlet-violet", "egg", 0]]),
  move("ember-gen2", [["gold-silver", "level-up", 5]]),
]);

const rows = () =>
  within(screen.getByRole("tabpanel"))
    .getAllByRole("row")
    .slice(1)
    .map((r) => within(r).getAllByRole("cell").slice(0, 2).map((c) => c.textContent).join(" "));

const checked = (group: string) =>
  within(screen.getByRole("group", { name: group }))
    .getAllByRole("radio")
    .find((r) => (r as HTMLInputElement).checked)
    ?.closest("label")?.textContent;

describe("MovesExplorer", () => {
  it("lists only the generations the Pokémon has data for", () => {
    render(<MovesExplorer data={data} />);
    const gens = within(screen.getByRole("group", { name: "Generation" }))
      .getAllByRole("radio")
      .map((r) => r.closest("label")?.textContent);
    expect(gens).toEqual(["I", "II", "IX"]);
  });

  it("defaults to the newest main-series game, with level-up moves in level order", () => {
    render(<MovesExplorer data={data} />);
    expect(checked("Generation")).toBe("IX");
    expect(checked("Game")).toBe("Scarlet / Violet");
    expect(rows()).toEqual(["Evo Air Slash", "1 Ember", "30 Flamethrower"]);
  });

  it("switches generation, picking that generation's newest main game", async () => {
    const user = userEvent.setup();
    render(<MovesExplorer data={data} />);
    await user.click(screen.getByRole("radio", { name: "I" }));

    expect(checked("Game")).toBe("Yellow");
    // Japan-only releases are listed after the main games.
    const games = within(screen.getByRole("group", { name: "Game" }))
      .getAllByRole("radio")
      .map((r) => r.closest("label")?.textContent);
    expect(games).toEqual(["Red / Blue", "Yellow", "Red / Green (Japan)"]);
    expect(rows()).toEqual(["1 Ember", "36 Slash", "46 Flamethrower"]);

    await user.click(screen.getByRole("radio", { name: "Red / Blue" }));
    expect(rows()).toEqual(["1 Ember", "36 Slash"]);
  });

  it("shows learn-method tabs with counts and hides empty ones", async () => {
    const user = userEvent.setup();
    render(<MovesExplorer data={data} />);
    const tabs = screen.getAllByRole("tab").map((t) => t.textContent);
    expect(tabs).toEqual(["Level-up3", "Egg1"]);

    await user.click(screen.getByRole("tab", { name: /egg/i }));
    expect(screen.getByRole("tab", { name: /egg/i })).toHaveAttribute("aria-selected", "true");
    expect(within(screen.getByRole("tabpanel")).getByText("Dragon Dance")).toBeInTheDocument();
  });

  it("falls back to an available method when the chosen one doesn't exist in a game", async () => {
    const user = userEvent.setup();
    render(<MovesExplorer data={data} />);
    await user.click(screen.getByRole("tab", { name: /egg/i }));
    await user.click(screen.getByRole("radio", { name: "I" })); // Yellow has no egg moves
    expect(screen.getByRole("tab", { name: /level-up/i })).toHaveAttribute("aria-selected", "true");
  });

  it("puts the selected game in the URL and reads it back", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<MovesExplorer data={data} />);
    await user.click(screen.getByRole("radio", { name: "II" }));
    expect(window.location.search).toBe("?game=gold-silver");
    expect(window.location.hash).toBe("#moves");
    unmount();

    render(<MovesExplorer data={data} />);
    expect(checked("Game")).toBe("Gold / Silver");
  });

  it("shows move details from the static data", () => {
    render(<MovesExplorer data={data} />);
    const flamethrower = screen.getByRole("link", { name: "Flamethrower" }).closest("tr")!;
    expect(within(flamethrower).getByText("fire")).toBeInTheDocument();
    expect(flamethrower).toHaveTextContent("special");
    expect(flamethrower).toHaveTextContent("90");
    expect(flamethrower).toHaveTextContent("100%");
  });

  it("handles a Pokémon without move data", () => {
    render(<MovesExplorer data={buildLearnsets([])} />);
    expect(screen.getByText(/no move data/i)).toBeInTheDocument();
  });
});
