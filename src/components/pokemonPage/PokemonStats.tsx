import { PokemonData } from "@/types/pokemonTypes";

const MAX_STAT = 255;

const LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

/** Colour scale used by most fan sites: low = red, high = teal. */
function barColor(value: number) {
  if (value < 50) return "bg-red-400";
  if (value < 80) return "bg-orange-400";
  if (value < 100) return "bg-yellow-400";
  if (value < 130) return "bg-lime-400";
  return "bg-teal-400";
}

export default function PokemonStats({ pokemon }: { pokemon: PokemonData }) {
  const total = pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0);

  return (
    <section aria-labelledby="base-stats" className="px-2 pb-4">
      <h2 id="base-stats" className="my-4 text-3xl">
        Base stats
      </h2>
      <dl className="space-y-3">
        {pokemon.stats.map(({ stat, base_stat }) => (
          <div
            key={stat.name}
            className="grid grid-cols-[5.5rem_3ch_1fr] items-center gap-3 text-left text-base"
          >
            <dt className="text-white/70">{LABELS[stat.name] ?? stat.name}</dt>
            <dd className="text-right font-mono font-semibold tabular-nums">
              {base_stat}
            </dd>
            <dd
              role="meter"
              aria-label={LABELS[stat.name] ?? stat.name}
              aria-valuemin={0}
              aria-valuemax={MAX_STAT}
              aria-valuenow={base_stat}
              className="h-2.5 overflow-hidden rounded-full bg-white/10"
            >
              <div
                className={`stat-bar h-full rounded-full ${barColor(base_stat)}`}
                style={{ width: `${(base_stat / MAX_STAT) * 100}%` }}
              />
            </dd>
          </div>
        ))}
        <div className="grid grid-cols-[5.5rem_3ch_1fr] items-center gap-3 border-t border-white/10 pt-3 text-left text-base">
          <dt className="font-semibold">Total</dt>
          <dd className="text-right font-mono font-bold tabular-nums text-sky-300">
            {total}
          </dd>
        </div>
      </dl>
    </section>
  );
}
