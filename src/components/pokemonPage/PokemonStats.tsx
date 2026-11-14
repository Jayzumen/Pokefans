import type { Stat } from "@/types/pokemonTypes";

const MAX_STAT = 255;

const LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

/** Low = warm, high = cool; readable on light and dark cards. */
function barColor(value: number) {
  if (value < 50) return "bg-red-400";
  if (value < 80) return "bg-orange-400";
  if (value < 100) return "bg-amber-400";
  if (value < 130) return "bg-lime-500";
  return "bg-emerald-500";
}

export default function PokemonStats({ stats }: { stats: Stat[] }) {
  const total = stats.reduce((sum, s) => sum + s.base_stat, 0);

  return (
    <dl className="space-y-3">
      {stats.map(({ stat, base_stat }) => {
        const label = LABELS[stat.name] ?? stat.name;
        return (
          <div
            key={stat.name}
            className="grid grid-cols-[4.5rem_2.5rem_1fr] items-center gap-3"
          >
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="text-right font-mono text-sm font-medium tabular-nums">
              {base_stat}
            </dd>
            {/* The meter lives inside the <dd> so the list stays valid HTML. */}
            <dd>
              <div
                role="meter"
                aria-label={label}
                aria-valuemin={0}
                aria-valuemax={MAX_STAT}
                aria-valuenow={base_stat}
                className="h-2 overflow-hidden rounded-full bg-muted"
              >
                <div
                  className={`stat-bar h-full rounded-full ${barColor(base_stat)}`}
                  style={{ width: `${(base_stat / MAX_STAT) * 100}%` }}
                />
              </div>
            </dd>
          </div>
        );
      })}
      <div className="grid grid-cols-[4.5rem_2.5rem_1fr] items-center gap-3 border-t pt-3">
        <dt className="text-sm font-semibold">Total</dt>
        <dd className="text-right font-mono text-sm font-bold tabular-nums">
          {total}
        </dd>
      </div>
    </dl>
  );
}
