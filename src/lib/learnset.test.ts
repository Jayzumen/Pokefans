import { describe, expect, it } from "vitest";
import type { Move } from "@/types/pokemonTypes";
import { buildLearnsets } from "./learnset";

/** Build a PokeAPI-shaped move entry. */
function move(name: string, details: [game: string, method: string, level: number][]): Move {
  return {
    move: { name, url: `https://pokeapi.co/api/v2/move/${name}/` },
    version_group_details: details.map(([game, method, level]) => ({
      level_learned_at: level,
      move_learn_method: { name: method, url: "" },
      version_group: { name: game, url: "" },
    })),
  };
}

const fixture: Move[] = [
  move("flamethrower", [
    ["red-blue", "level-up", 46],
    ["scarlet-violet", "level-up", 30],
    ["red-blue", "machine", 0],
  ]),
  move("ember", [
    ["red-blue", "level-up", 1],
    ["red-blue", "level-up", 9], // learned twice in one game
    ["scarlet-violet", "level-up", 1],
  ]),
  move("air-slash", [["scarlet-violet", "level-up", 0]]), // on evolution
  move("dragon-dance", [["scarlet-violet", "egg", 0]]),
  move("blast-burn", [["scarlet-violet", "tutor", 0]]),
  move("volt-tackle", [["scarlet-violet", "light-ball-egg", 0]]), // unusual method
  move("not-a-real-move", [["scarlet-violet", "machine", 0]]),
];

describe("buildLearnsets", () => {
  const data = buildLearnsets(fixture);

  it("lists only games with data, in release order", () => {
    expect(data.games.map((g) => g.name)).toEqual(["red-blue", "scarlet-violet"]);
    expect(data.games[0]).toMatchObject({ gen: 1, label: "Red / Blue" });
  });

  it("sorts level-up moves by level, keeping repeat levels", () => {
    expect(data.learnsets["red-blue"]["level-up"]).toEqual([
      ["ember", 1],
      ["ember", 9],
      ["flamethrower", 46],
    ]);
    expect(data.learnsets["scarlet-violet"]["level-up"]).toEqual([
      ["air-slash", 0],
      ["ember", 1],
      ["flamethrower", 30],
    ]);
  });

  it("groups other learn methods, sorted by name, with unusual methods under other", () => {
    const sv = data.learnsets["scarlet-violet"];
    expect(sv.egg).toEqual([["dragon-dance", 0]]);
    expect(sv.tutor).toEqual([["blast-burn", 0]]);
    expect(sv.other).toEqual([["volt-tackle", 0]]);
    expect(data.learnsets["red-blue"].machine).toEqual([["flamethrower", 0]]);
  });

  it("only ships details for moves this Pokémon uses", () => {
    expect(Object.keys(data.meta).sort()).toEqual(
      ["air-slash", "blast-burn", "dragon-dance", "ember", "flamethrower", "volt-tackle"].sort(),
    );
    expect(data.meta.flamethrower).toEqual(["fire", "special", 90, 100, 15]);
  });

  it("handles a Pokémon without moves", () => {
    expect(buildLearnsets([])).toEqual({ games: [], learnsets: {}, meta: {} });
  });
});
