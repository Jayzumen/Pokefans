import Link from "next/link";
import { GitHubIcon, PokeballIcon } from "./icons";
import { Container } from "./layout";

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/pokedex", label: "Pokédex" },
      { href: "/generations/1", label: "Generations" },
      { href: "/types", label: "Types" },
    ],
  },
  {
    title: "Data",
    links: [
      { href: "/moves", label: "Moves" },
      { href: "/abilities", label: "Abilities" },
      { href: "/teams", label: "Teams" },
    ],
  },
];

const linkClass =
  "text-muted-foreground transition-colors duration-150 hover:text-foreground";

export default function Footer() {
  return (
    <footer className="mt-16 border-t">
      <Container className="grid gap-10 py-12 md:grid-cols-[2fr_1fr_1fr]">
        <div className="space-y-3">
          <p className="flex items-center gap-2 font-semibold tracking-[-0.02em]">
            <PokeballIcon className="size-5 text-primary" />
            Pokéfans
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            A fast, friendly field guide to every Pokémon. Data from{" "}
            <a
              href="https://pokeapi.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline-offset-4 hover:underline"
            >
              PokeAPI
            </a>
            .
          </p>
          <a
            href="https://github.com/Jayzumen/pokefans"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 text-sm ${linkClass}`}
          >
            <GitHubIcon className="size-4" />
            Source on GitHub
          </a>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="eyebrow mb-3 text-muted-foreground">{col.title}</h2>
            <ul className="space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>
      <Container className="border-t py-6 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Pokéfans. Pokémon and its names are
        trademarks of Nintendo, Game Freak and Creatures. This is a fan project.
      </Container>
    </footer>
  );
}
