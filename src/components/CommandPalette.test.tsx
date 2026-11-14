import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

import CommandPalette from "./CommandPalette";

const options = () => screen.getAllByRole("option").map((o) => o.textContent);

function setup() {
  const onOpenChange = vi.fn();
  render(<CommandPalette open onOpenChange={onOpenChange} />);
  return { onOpenChange, input: screen.getByRole("combobox") };
}

beforeEach(() => push.mockClear());

describe("CommandPalette", () => {
  it("shows the site's pages before anything is typed", () => {
    setup();
    expect(options()).toContain("Pokédex");
    expect(options()).toContain("Types & type chart");
  });

  it("finds Pokémon, moves, abilities and types, grouped", async () => {
    const { input } = setup();
    await userEvent.type(input, "thun");
    const list = screen.getByRole("listbox");
    expect(within(list).getByText("Pokémon")).toBeInTheDocument();
    expect(within(list).getByText("Moves")).toBeInTheDocument();
    expect(options()).toContain("Thunderbolt");
    expect(options().some((o) => o?.startsWith("thundurus"))).toBe(true);
  });

  it("ranks exact and prefix matches first", async () => {
    const { input } = setup();
    await userEvent.type(input, "pikachu");
    expect(options()[0]).toMatch(/^pikachu#025/);
  });

  it("matches dex numbers", async () => {
    const { input } = setup();
    await userEvent.type(input, "#6");
    expect(options()[0]).toMatch(/^charizard#006/);
  });

  it("navigates with the keyboard and closes", async () => {
    const { input, onOpenChange } = setup();
    await userEvent.type(input, "fire");
    await userEvent.keyboard("{ArrowDown}");
    const second = screen.getAllByRole("option")[1];
    expect(second).toHaveAttribute("aria-selected", "true");
    expect(input).toHaveAttribute("aria-activedescendant", second.id);

    await userEvent.keyboard("{Enter}");
    expect(push).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("wraps around when moving up from the first result", async () => {
    const { input } = setup();
    await userEvent.type(input, "fire");
    await userEvent.keyboard("{ArrowUp}");
    const all = screen.getAllByRole("option");
    expect(all.at(-1)).toHaveAttribute("aria-selected", "true");
  });

  it("opens a result on click", async () => {
    const { input } = setup();
    await userEvent.type(input, "levitate");
    await userEvent.click(screen.getByRole("option", { name: /levitate/i }));
    expect(push).toHaveBeenCalledWith("/abilities/levitate");
  });

  it("says when nothing matches", async () => {
    const { input } = setup();
    await userEvent.type(input, "qqqqzzzz");
    expect(screen.getByText(/nothing found/i)).toBeInTheDocument();
  });
});
