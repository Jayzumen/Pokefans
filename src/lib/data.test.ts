import { describe, expect, it } from "vitest";
import names from "@/data/names.json";
import moves from "@/data/moves.json";
import typeChart from "@/data/type-chart.json";
import versionGroups from "@/data/version-groups.json";
import { pokemonIndex } from "./pokemon-index";
import { TYPE_NAMES } from "./types";

/** Guards the generated files in src/data against a broken `index:build`. */
describe("generated static data", () => {
  it("has all 1,025 Pokémon with consecutive ids", () => {
    expect(pokemonIndex).toHaveLength(1025);
    pokemonIndex.forEach((p, i) => expect(p.id).toBe(i + 1));
  });

  it("gives every Pokémon one or two valid, distinct types and a generation", () => {
    for (const p of pokemonIndex) {
      expect(p.types.length).toBeGreaterThanOrEqual(1);
      expect(p.types.length).toBeLessThanOrEqual(2);
      expect(new Set(p.types).size).toBe(p.types.length);
      for (const t of p.types) expect(TYPE_NAMES).toContain(t);
      expect(p.gen).toBeGreaterThanOrEqual(1);
      expect(p.gen).toBeLessThanOrEqual(9);
      expect(p.name).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("has unique Pokémon names", () => {
    expect(new Set(pokemonIndex.map((p) => p.name)).size).toBe(pokemonIndex.length);
  });

  it("only uses valid multipliers in the type chart", () => {
    expect(Object.keys(typeChart).sort()).toEqual([...TYPE_NAMES].sort());
    for (const row of Object.values(typeChart)) {
      for (const [defender, m] of Object.entries(row)) {
        expect(TYPE_NAMES).toContain(defender);
        expect([0, 0.5, 2]).toContain(m);
      }
    }
  });

  it("lists games in release order with a generation and label", () => {
    const orders = versionGroups.map((g) => g.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
    for (const g of versionGroups) {
      expect(g.gen).toBeGreaterThanOrEqual(1);
      expect(g.gen).toBeLessThanOrEqual(9);
      expect(g.label.length).toBeGreaterThan(0);
      expect(typeof g.side).toBe("boolean");
    }
  });

  it("has details for every searchable move", () => {
    const details = moves as unknown as Record<string, unknown[]>;
    for (const name of names.moves) {
      const tuple = details[name];
      expect(tuple, name).toBeDefined();
      expect(TYPE_NAMES as readonly string[]).toContain(tuple[0]);
      expect(["physical", "special", "status"]).toContain(tuple[1]);
    }
  });

  it("has sorted, unique move and ability names", () => {
    for (const list of [names.moves, names.abilities]) {
      expect(new Set(list).size).toBe(list.length);
      expect(list).toEqual([...list].sort());
    }
  });
});
