import { defensiveProfile, formatMultiplier } from "@/lib/type-chart";
import { TypeChip } from "../TypeChip";

const LABELS: Record<number, string> = {
  4: "Very weak",
  2: "Weak",
  0.5: "Resists",
  0.25: "Strongly resists",
  0: "Immune",
};

/** Damage this Pokémon takes from each attacking type. */
export default function Matchups({ types }: { types: string[] }) {
  const profile = defensiveProfile(types);
  return (
    <div className="surface p-6 md:p-8">
      <p className="text-sm text-muted-foreground">
        Damage taken from each attacking type. Everything not listed deals
        normal (×1) damage.
      </p>
      <dl className="mt-4 divide-y">
        {profile.map(({ multiplier, types }) => (
          <div
            key={multiplier}
            className="grid gap-2 py-4 sm:grid-cols-[11rem_1fr] sm:items-center"
          >
            <dt className="flex items-baseline gap-2">
              <span className="font-mono text-lg font-semibold tabular-nums">
                ×{formatMultiplier(multiplier)}
              </span>
              <span className="text-sm text-muted-foreground">
                {LABELS[multiplier]}
              </span>
            </dt>
            <dd className="flex flex-wrap gap-1.5">
              {types.map((t) => (
                <TypeChip key={t} type={t} />
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
