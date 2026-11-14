import { cn } from "@/lib/utils";

/** Centered content column with the standard gutters (§4.5). */
export function Container({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-7xl px-5 md:px-8", className)}
      {...props}
    />
  );
}

/** Consistent page heading: eyebrow, title, description and actions. */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
  style,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <header
      className={cn("relative overflow-hidden border-b", className)}
      style={style}
    >
      <div aria-hidden className="dot-grid absolute inset-0 opacity-70" />
      <Container className="relative py-12 md:py-16">
        {eyebrow && (
          <p className="eyebrow fade-up mb-3 text-muted-foreground">{eyebrow}</p>
        )}
        <h1 className="fade-up text-4xl font-semibold tracking-[-0.035em] md:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="fade-up mt-4 max-w-2xl text-lg text-muted-foreground">
            {description}
          </p>
        )}
        {children && <div className="fade-up mt-8">{children}</div>}
      </Container>
    </header>
  );
}

/** Titled section inside a page. */
export function Section({
  title,
  description,
  action,
  children,
  className,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("py-10 md:py-14", className)}>
      {(title || action) && (
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            {title && (
              <h2 className="text-2xl font-semibold tracking-[-0.02em] md:text-3xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-muted-foreground">{description}</p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

/** Label/value pair in mono, for spec-sheet style data. */
export function Spec({
  label,
  value,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <div>
      <dt className="eyebrow text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-mono text-xl font-medium tabular-nums">{value}</dd>
    </div>
  );
}
