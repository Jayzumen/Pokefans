import Link from "next/link";
import { cn } from "@/lib/utils";
import { typeVars } from "@/lib/types";

const sizes = {
  sm: { chip: "h-6 gap-1.5 pl-0.5 pr-2.5 text-xs", icon: "size-5 p-[3px]" },
  md: { chip: "h-8 gap-2 pl-1 pr-3 text-sm", icon: "size-6 p-1" },
  lg: { chip: "h-10 gap-2.5 pl-1 pr-4 text-base", icon: "size-8 p-1.5" },
};

/**
 * Type label: icon on a solid type-colored dot, name in type "ink" on a
 * soft tinted background. Renders a link unless `link={false}` (e.g. when
 * it sits inside another link such as a card).
 */
export function TypeChip({
  type,
  size = "sm",
  link = true,
  className,
}: {
  type: string;
  size?: keyof typeof sizes;
  link?: boolean;
  className?: string;
}) {
  const s = sizes[size];
  const content = (
    <>
      <span
        aria-hidden
        className={cn("grid shrink-0 place-items-center rounded-full", s.icon)}
        style={{ background: "var(--t)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- tiny static SVG */}
        <img src={`/typeImages/${type}.svg`} alt="" className="size-full" />
      </span>
      <span className="font-medium capitalize">{type}</span>
    </>
  );
  const classes = cn(
    "type-soft type-ink inline-flex items-center rounded-full ring-1 ring-inset ring-[color-mix(in_oklch,var(--t)_30%,transparent)]",
    s.chip,
    className,
  );

  if (!link) {
    return (
      <span className={classes} style={typeVars([type])}>
        {content}
      </span>
    );
  }
  return (
    <Link
      href={`/types/${type}`}
      className={cn(
        classes,
        "outline-none transition-[filter,transform] duration-150 hover:brightness-[1.04] hover:saturate-150 focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-[0.97]",
      )}
      style={typeVars([type])}
    >
      {content}
    </Link>
  );
}

export function TypeChips({
  types,
  size,
  link,
  className,
}: {
  types: readonly string[];
  size?: keyof typeof sizes;
  link?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {types.map((t) => (
        <TypeChip key={t} type={t} size={size} link={link} />
      ))}
    </div>
  );
}
