import { TypeChip } from "../TypeChip";
import { typeRelations } from "@/lib/type-chart";

function Row({
  multiplier,
  label,
  types,
}: {
  multiplier: string;
  label: string;
  types: readonly string[];
}) {
  return (
    <div className="grid gap-2 py-4 sm:grid-cols-[10.5rem_1fr] sm:items-center">
      <dt className="flex items-baseline gap-2">
        <span className="font-mono text-lg font-semibold tabular-nums">
          {multiplier}
        </span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </dt>
      <dd className="flex flex-wrap gap-1.5">
        {types.length > 0 ? (
          types.map((t) => <TypeChip key={t} type={t} />)
        ) : (
          <span className="text-sm text-muted-foreground">None</span>
        )}
      </dd>
    </div>
  );
}

/** Attack and defence multipliers for one type, from the static type chart. */
export default function DamageRelations({ type }: { type: string }) {
  const d = typeRelations(type);
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="surface p-6" aria-labelledby="attacking">
        <h2 id="attacking" className="text-lg font-semibold">
          When attacking
        </h2>
        <p className="text-sm text-muted-foreground">
          How much damage <span className="capitalize">{type}</span>{" "}
          moves deal to…
        </p>
        <dl className="mt-2 divide-y">
          <Row multiplier="×2" label="super effective" types={d.double_damage_to} />
          <Row multiplier="×½" label="not very effective" types={d.half_damage_to} />
          <Row multiplier="×0" label="no effect" types={d.no_damage_to} />
        </dl>
      </section>
      <section className="surface p-6" aria-labelledby="defending">
        <h2 id="defending" className="text-lg font-semibold">
          When defending
        </h2>
        <p className="text-sm text-muted-foreground">
          How much damage <span className="capitalize">{type}</span>{" "}
          Pokémon take from…
        </p>
        <dl className="mt-2 divide-y">
          <Row multiplier="×2" label="weak to" types={d.double_damage_from} />
          <Row multiplier="×½" label="resists" types={d.half_damage_from} />
          <Row multiplier="×0" label="immune to" types={d.no_damage_from} />
        </dl>
      </section>
    </div>
  );
}
