import { describe, expect, it } from "vitest";
import {
  artworkTransitionName,
  findPokemon,
  getPokemonByGen,
  getPokemonById,
  pokemonOfTheDay,
  resolveRefs,
} from "./pokemon-index";
import { artworkSourceUrl, artworkUrl, formatDexNumber, idFromUrl } from "./pokemon";

describe("pokemon helpers", () => {
  it("serves local WebP artwork for default Pokémon and the PNG for forms", () => {
    expect(artworkUrl(25)).toBe("/artwork/25.webp");
    expect(artworkUrl("1025")).toBe("/artwork/1025.webp");
    expect(artworkUrl(10034)).toBe(artworkSourceUrl(10034)); // Mega Charizard X
    expect(artworkSourceUrl(25)).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
    );
  });

  it("reads ids from resource URLs", () => {
    expect(idFromUrl("https://pokeapi.co/api/v2/pokemon/25/")).toBe("25");
    expect(idFromUrl("https://pokeapi.co/api/v2/pokemon/10034")).toBe("10034");
  });

  it("pads dex numbers to three digits", () => {
    expect(formatDexNumber(1)).toBe("#001");
    expect(formatDexNumber(25)).toBe("#025");
    expect(formatDexNumber(1025)).toBe("#1025");
  });
});

describe("pokemon index lookups", () => {
  it("finds Pokémon by name or dex number", () => {
    expect(findPokemon("pikachu")?.id).toBe(25);
    expect(findPokemon("25")?.name).toBe("pikachu");
    expect(findPokemon("charizard-mega-x")).toBeUndefined();
    expect(findPokemon("0")).toBeUndefined();
    expect(getPokemonById(6)?.types).toEqual(["fire", "flying"]);
  });

  it("returns each generation's Pokémon", () => {
    expect(getPokemonByGen(1)).toHaveLength(151);
    expect(getPokemonByGen(1)[0].name).toBe("bulbasaur");
    expect(getPokemonByGen(9).at(-1)?.name).toBe("pecharunt");
    const total = [1, 2, 3, 4, 5, 6, 7, 8, 9].reduce(
      (n, g) => n + getPokemonByGen(g).length,
      0,
    );
    expect(total).toBe(1025);
  });

  it("resolves PokeAPI refs, skipping alternate forms and duplicates, sorted by id", () => {
    const refs = [
      { url: "https://pokeapi.co/api/v2/pokemon/6/" },
      { url: "https://pokeapi.co/api/v2/pokemon/10034/" }, // Mega Charizard X
      { url: "https://pokeapi.co/api/v2/pokemon/4/" },
      { url: "https://pokeapi.co/api/v2/pokemon/6/" },
    ];
    expect(resolveRefs(refs).map((p) => p.name)).toEqual(["charmander", "charizard"]);
  });

  it("gives a stable set of distinct Pokémon per day that changes between days", () => {
    const day = new Date("2026-11-14T08:00:00Z");
    const sameDay = new Date("2026-11-14T23:00:00Z");
    const nextDay = new Date("2026-11-15T08:00:00Z");

    const a = pokemonOfTheDay(7, day).map((p) => p.id);
    expect(pokemonOfTheDay(7, sameDay).map((p) => p.id)).toEqual(a);
    expect(new Set(a).size).toBe(7);
    expect(pokemonOfTheDay(7, nextDay).map((p) => p.id)).not.toEqual(a);
  });

  it("uses one view-transition name per Pokémon", () => {
    expect(artworkTransitionName(6)).toBe("pokemon-art-6");
  });
});
