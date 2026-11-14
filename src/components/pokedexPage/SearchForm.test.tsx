import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

let searchParams = new URLSearchParams();
vi.mock("next/navigation", () => ({ useSearchParams: () => searchParams }));

import SearchForm from "./SearchForm";

const cardNames = () =>
  screen.queryAllByRole("link").map((a) => a.getAttribute("href")!.replace("/pokemon/", ""));

beforeEach(() => {
  searchParams = new URLSearchParams();
});

describe("Pokédex search and filters", () => {
  it("shows the first 24 of all 1,025 Pokémon and loads more on demand", async () => {
    render(<SearchForm />);
    expect(screen.getByText("1025 Pokémon")).toBeInTheDocument();
    expect(cardNames()).toHaveLength(24);
    expect(cardNames()[0]).toBe("bulbasaur");

    await userEvent.click(screen.getByRole("button", { name: /show more/i }));
    expect(cardNames()).toHaveLength(48);
  });

  it("searches by name and by dex number", async () => {
    const user = userEvent.setup();
    render(<SearchForm />);
    const input = screen.getByRole("searchbox", { name: /search for a pokémon/i });

    await user.type(input, "pikach");
    expect(cardNames()).toEqual(["pikachu"]);

    await user.clear(input);
    await user.type(input, "#25");
    expect(cardNames()).toContain("pikachu");
    expect(cardNames().every((n) => n)).toBe(true);
  });

  it("combines type filters (Pokémon must have both) with generation", async () => {
    const user = userEvent.setup();
    render(<SearchForm />);
    await user.click(screen.getByRole("button", { name: "fire" }));
    await user.click(screen.getByRole("button", { name: "flying" }));
    await user.click(screen.getByRole("button", { name: "Generation I" }));
    expect(cardNames()).toEqual(["charizard", "moltres"]);
    expect(window.location.search).toBe("?type=fire%2Cflying&gen=1");
  });

  it("keeps at most two types, replacing the oldest", async () => {
    const user = userEvent.setup();
    render(<SearchForm />);
    for (const t of ["fire", "water", "grass"]) {
      await user.click(screen.getByRole("button", { name: t }));
    }
    expect(screen.getByRole("button", { name: "fire" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "water" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "grass" })).toHaveAttribute("aria-pressed", "true");
  });

  it("reads filters from the URL and ignores invalid values", () => {
    searchParams = new URLSearchParams("q=char&type=fire,notatype&gen=42&sort=evil");
    render(<SearchForm />);
    expect(screen.getByRole("searchbox")).toHaveValue("char");
    expect(screen.getByRole("button", { name: "fire" })).toHaveAttribute("aria-pressed", "true");
    // gen=42 and sort=evil fall back to "All" and dex order
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("combobox", { name: /sort/i })).toHaveValue("id");
    expect(cardNames().slice(0, 3)).toEqual(["charmander", "charmeleon", "charizard"]);
  });

  it("sorts by name and clears everything", async () => {
    const user = userEvent.setup();
    render(<SearchForm />);
    await user.selectOptions(screen.getByRole("combobox", { name: /sort/i }), "name-desc");
    expect(cardNames()[0]).toBe("zygarde-50"); // PokeAPI name of the default form

    await user.click(screen.getByRole("button", { name: /clear filters/i }));
    expect(cardNames()[0]).toBe("bulbasaur");
    expect(window.location.search).toBe("");
  });

  it("explains when nothing matches", async () => {
    const user = userEvent.setup();
    render(<SearchForm />);
    await user.type(screen.getByRole("searchbox"), "zzzz");
    expect(screen.getByText(/no pokémon match/i)).toBeInTheDocument();
    expect(screen.getByText("0 Pokémon")).toBeInTheDocument();
  });

  it("keeps the heading outline intact", () => {
    render(<SearchForm />);
    const results = screen.getByRole("heading", { level: 2, name: "Results" });
    expect(results).toBeInTheDocument();
    expect(within(document.body).getAllByRole("heading", { level: 3 }).length).toBe(24);
  });
});
