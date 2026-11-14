import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { NameSearch } from "./NameSearch";
import PokemonCard from "./PokemonCard";
import PokemonStats from "./pokemonPage/PokemonStats";
import TypeChart from "./typesPage/TypeChart";
import { TypeChip } from "./TypeChip";

describe("TypeChip", () => {
  it("links to the type page by default", () => {
    render(<TypeChip type="fire" />);
    expect(screen.getByRole("link", { name: /fire/i })).toHaveAttribute("href", "/types/fire");
  });

  it("renders plain text inside other links", () => {
    render(<TypeChip type="water" link={false} />);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText("water")).toBeInTheDocument();
  });
});

describe("PokemonCard", () => {
  it("is one link with number, name, artwork and non-link type chips", () => {
    render(<PokemonCard pokemon={{ id: 6, name: "charizard", types: ["fire", "flying"] }} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/pokemon/charizard");
    expect(within(link).getByText("#006")).toBeInTheDocument();
    expect(within(link).getByRole("heading", { name: "charizard" })).toBeInTheDocument();
    expect(within(link).getByRole("img", { name: /charizard official artwork/i })).toBeInTheDocument();
    // No nested links (invalid HTML and confusing for screen readers).
    expect(within(link).queryAllByRole("link")).toHaveLength(0);
  });
});

describe("PokemonStats", () => {
  const stats = [
    ["hp", 78],
    ["attack", 84],
    ["defense", 78],
    ["special-attack", 109],
    ["special-defense", 85],
    ["speed", 100],
  ].map(([name, base_stat]) => ({ base_stat: base_stat as number, effort: 0, stat: { name: name as string, url: "" } }));

  it("exposes each stat as a meter and sums the total", () => {
    render(<PokemonStats stats={stats} />);
    const meters = screen.getAllByRole("meter");
    expect(meters).toHaveLength(6);
    expect(screen.getByRole("meter", { name: "Sp. Atk" })).toHaveAttribute("aria-valuenow", "109");
    expect(meters[0]).toHaveAttribute("aria-valuemax", "255");
    expect(screen.getByText("534")).toBeInTheDocument();
  });
});

describe("TypeChart", () => {
  it("renders all 18×18 matchups with readable labels", () => {
    render(<TypeChart />);
    const cells = screen.getAllByRole("cell");
    expect(cells).toHaveLength(18 * 18);
    expect(screen.getByLabelText("water against fire: ×2")).toHaveTextContent("2");
    expect(screen.getByLabelText("normal against ghost: ×0")).toHaveTextContent("0");
    expect(screen.getByLabelText("fire against water: ×½")).toHaveTextContent("½");
    expect(screen.getByLabelText("normal against normal: ×1")).toHaveTextContent("");
  });

  it("is keyboard reachable", async () => {
    render(<TypeChart />);
    await userEvent.tab();
    expect(document.activeElement).toHaveAttribute("aria-label", "normal against normal: ×1");
  });
});

describe("NameSearch", () => {
  const names = ["thunderbolt", "thunder-punch", "flamethrower", "ice-beam"];
  const renderSearch = () =>
    render(
      <NameSearch names={names} basePath="/moves" noun="move" placeholder="Search">
        <p>Featured content</p>
      </NameSearch>,
    );

  it("shows the featured content until the user types", async () => {
    renderSearch();
    expect(screen.getByText("Featured content")).toBeInTheDocument();
    expect(screen.getByText("4 moves")).toBeInTheDocument();
    await userEvent.type(screen.getByRole("searchbox"), "thunder");
    expect(screen.queryByText("Featured content")).toBeNull();
    expect(screen.getAllByRole("link").map((a) => a.getAttribute("href"))).toEqual([
      "/moves/thunderbolt",
      "/moves/thunder-punch",
    ]);
  });

  it("matches words across hyphens", async () => {
    renderSearch();
    await userEvent.type(screen.getByRole("searchbox"), "ice beam");
    expect(screen.getByRole("link", { name: "Ice Beam" })).toBeInTheDocument();
  });

  it("uses an explicit plural", () => {
    render(
      <NameSearch names={["levitate"]} basePath="/abilities" noun="ability" plural="abilities" placeholder="">
        <span />
      </NameSearch>,
    );
    expect(screen.getByText("1 abilities")).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "Search abilities" })).toBeInTheDocument();
  });
});
