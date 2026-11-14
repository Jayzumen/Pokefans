import { describe, expect, it } from "vitest";
import { describe as describeEntry, english } from "./entries";
import { cleanText, isTypeName, titleCase, typeVars } from "./types";
import { MIN_PASSWORD_LENGTH, USERNAME_PATTERN } from "./validation";

describe("types helpers", () => {
  it("recognises the 18 type names", () => {
    expect(isTypeName("fire")).toBe(true);
    expect(isTypeName("stellar")).toBe(false);
    expect(isTypeName("Fire")).toBe(false);
  });

  it("sets type CSS variables, repeating a single type", () => {
    expect(typeVars(["fire", "flying"])).toEqual({
      "--t": "var(--type-fire)",
      "--t2": "var(--type-flying)",
    });
    expect(typeVars(["water"])).toEqual({
      "--t": "var(--type-water)",
      "--t2": "var(--type-water)",
    });
    expect(typeVars([])).toEqual({
      "--t": "var(--type-normal)",
      "--t2": "var(--type-normal)",
    });
  });

  it("title-cases slugs", () => {
    expect(titleCase("special-attack")).toBe("Special Attack");
    expect(titleCase("thunderbolt")).toBe("Thunderbolt");
  });

  it("cleans PokeAPI flavor text", () => {
    expect(cleanText("A strange seed was\nplanted on its\fback at birth.")).toBe(
      "A strange seed was planted on its back at birth.",
    );
    expect(cleanText(undefined)).toBeUndefined();
  });
});

describe("entries", () => {
  const en = { name: "en" };
  const de = { name: "de" };

  it("picks the English entry", () => {
    expect(english([{ language: de, x: 1 }, { language: en, x: 2 }])?.x).toBe(2);
    expect(english(undefined)).toBeUndefined();
  });

  it("prefers the short effect and fills in the effect chance", () => {
    expect(
      describeEntry({
        effect_entries: [
          {
            language: en,
            effect: "Long text",
            short_effect: "Has a $effect_chance% chance to paralyze.",
          },
        ],
        effect_chance: 10,
      }),
    ).toBe("Has a 10% chance to paralyze.");
  });

  it("falls back to the newest English flavor text, then a placeholder", () => {
    expect(
      describeEntry({
        flavor_text_entries: [
          { language: en, flavor_text: "Old text" },
          { language: de, flavor_text: "Deutsch" },
          { language: en, flavor_text: "New\ntext" },
        ],
      }),
    ).toBe("New text");
    expect(describeEntry({})).toBe("No description yet.");
  });
});

describe("validation", () => {
  it.each(["ash", "Ash_Ketchum", "trainer2026", "a_b"])("accepts username %j", (u) => {
    expect(USERNAME_PATTERN.test(u)).toBe(true);
  });

  it.each(["ab", "a".repeat(21), "ash ketchum", "ash-k", "äsh", "<b>", ""])(
    "rejects username %j",
    (u) => expect(USERNAME_PATTERN.test(u)).toBe(false),
  );

  it("requires at least 8 password characters", () => {
    expect(MIN_PASSWORD_LENGTH).toBe(8);
  });
});
