import Link from "next/link";
import { titleCase } from "@/lib/types";
import type { Move } from "@/types/pokemonTypes";

/**
 * Main-series games, newest first. PokeAPI's version-group ids are not in
 * release order (e.g. Japan-only releases were added later), so we rank
 * explicitly.
 */
const GAMES_NEWEST_FIRST = [
  "legends-za", "the-indigo-disk", "the-teal-mask", "scarlet-violet",
  "legends-arceus", "brilliant-diamond-shining-pearl", "the-crown-tundra",
  "the-isle-of-armor", "sword-shield", "lets-go-pikachu-lets-go-eevee",
  "ultra-sun-ultra-moon", "sun-moon", "omega-ruby-alpha-sapphire", "x-y",
  "black-2-white-2", "black-white", "heartgold-soulsilver", "platinum",
  "diamond-pearl", "emerald", "firered-leafgreen", "ruby-sapphire",
  "crystal", "gold-silver", "yellow", "red-blue",
];
const rank = (name: string) => {
  const i = GAMES_NEWEST_FIRST.indexOf(name);
  return i === -1 ? Infinity : i;
};

/**
 * Level-up learnset from the most recent game that has one, plus a count
 * of moves learned other ways (TM, egg, tutor).
 */
export default function Moves({ moves }: { moves: Move[] }) {
  // Find the newest main-series game with level-up data for this Pokémon.
  let latestGame = "";
  for (const m of moves) {
    for (const d of m.version_group_details) {
      const game = d.version_group.name;
      if (
        d.move_learn_method.name === "level-up" &&
        rank(game) < rank(latestGame)
      ) {
        latestGame = game;
      }
    }
  }
  const latest = latestGame;

  const levelUp: { name: string; level: number }[] = [];
  const other = new Set<string>();
  let gameName = "";
  for (const m of moves) {
    for (const d of m.version_group_details) {
      if (d.version_group.name !== latest) continue;
      if (d.move_learn_method.name === "level-up") {
        levelUp.push({ name: m.move.name, level: d.level_learned_at });
        gameName = d.version_group.name;
      } else {
        other.add(m.move.name);
      }
    }
  }
  levelUp.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));

  if (levelUp.length === 0) {
    return <p className="text-muted-foreground">No level-up moves recorded.</p>;
  }

  return (
    <div className="surface overflow-hidden">
      <p className="border-b px-6 py-3 text-sm text-muted-foreground">
        Level-up moves in{" "}
        <span className="font-medium text-foreground">{titleCase(gameName)}</span>
        {other.size > 0 && ` · plus ${other.size} by TM, egg or tutor`}
      </p>
      <ol className="grid divide-y sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3">
        {levelUp.map((m) => (
          <li key={`${m.name}-${m.level}`} className="sm:border-b">
            <Link
              href={`/moves/${m.name}`}
              className="flex items-center gap-4 px-6 py-3 outline-none transition-colors hover:bg-accent focus-visible:bg-accent"
            >
              <span className="w-12 font-mono text-sm text-muted-foreground tabular-nums">
                {m.level === 0 ? "Evo" : `Lv ${m.level}`}
              </span>
              <span className="font-medium">{titleCase(m.name)}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
