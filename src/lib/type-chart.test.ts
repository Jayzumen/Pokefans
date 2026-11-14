import { describe, expect, it } from "vitest";
import { defensiveProfile, formatMultiplier, multiplier, multiplierVs } from "./type-chart";

describe("type chart", () => {
  it("knows single-type matchups", () => {
    expect(multiplier("water", "fire")).toBe(2);
    expect(multiplier("fire", "water")).toBe(0.5);
    expect(multiplier("normal", "ghost")).toBe(0);
    expect(multiplier("normal", "normal")).toBe(1);
    expect(multiplier("unknown", "fire")).toBe(1);
  });

  it("multiplies dual-type matchups", () => {
    expect(multiplierVs("rock", ["fire", "flying"])).toBe(4); // Charizard
    expect(multiplierVs("ground", ["fire", "flying"])).toBe(0);
    expect(multiplierVs("grass", ["fire", "flying"])).toBe(0.25);
    expect(multiplierVs("electric", ["water", "ground"])).toBe(0); // Swampert
  });

  it("groups a Pokémon's weaknesses and resistances, strongest first", () => {
    const charizard = defensiveProfile(["fire", "flying"]);
    expect(charizard.map((g) => g.multiplier)).toEqual([4, 2, 0.5, 0.25, 0]);
    expect(charizard[0].types).toEqual(["rock"]);
    expect(charizard[1].types.sort()).toEqual(["electric", "water"]);
    expect(charizard.at(-1)?.types).toEqual(["ground"]);
  });

  it("leaves out neutral matchups", () => {
    const normal = defensiveProfile(["normal"]);
    expect(normal).toEqual([
      { multiplier: 2, types: ["fighting"] },
      { multiplier: 0, types: ["ghost"] },
    ]);
  });

  it("formats fractions for display", () => {
    expect(formatMultiplier(0.5)).toBe("½");
    expect(formatMultiplier(0.25)).toBe("¼");
    expect(formatMultiplier(4)).toBe("4");
  });
});
