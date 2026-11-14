import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { PokemonTypes } from "@/assets/constants";
import { artworkUrl, formatDexNumber } from "@/lib/pokemon";
import type { IndexPokemon } from "@/lib/pokemon-index";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

/** Minimal shape a card needs: works with index entries and team members. */
export type CardPokemon = Pick<IndexPokemon, "id" | "name" | "types">;

export const colorOfType = (type: string | undefined) =>
  PokemonTypes.find((t) => t.name === type)?.color ?? "#737373";

export const cardButtonHover =
  "group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground dark:group-hover:border-primary dark:group-hover:bg-primary dark:hover:border-primary dark:hover:bg-primary";

export function TypeBadge({ type }: { type: string }) {
  const color = colorOfType(type);
  return (
    <Badge
      variant="secondary"
      className="capitalize text-xs"
      style={{
        backgroundColor: color + "20",
        color,
        borderColor: color + "40",
      }}
    >
      {type}
    </Badge>
  );
}

export default function PokemonCard({
  pokemon,
  priority = false,
}: {
  pokemon: CardPokemon;
  priority?: boolean;
}) {
  const [first, second = first] = pokemon.types.map(colorOfType);

  return (
    <Card className="pokemon-card-hover group overflow-hidden border-2 hover:border-primary/20 bg-card">
      <CardHeader className="pb-2">
        <div className="text-sm text-muted-foreground font-mono">
          {formatDexNumber(pokemon.id)}
        </div>
        <CardTitle className="text-xl capitalize">{pokemon.name}</CardTitle>
      </CardHeader>

      <CardContent className="text-center pb-2">
        <div
          className="relative mb-4 p-4 rounded-lg"
          style={{
            background: `linear-gradient(135deg, ${first}15 0%, ${second}15 100%)`,
          }}
        >
          <Link href={`/pokemon/${pokemon.name}`} tabIndex={-1} aria-hidden="true">
            <Image
              src={artworkUrl(pokemon.id)}
              alt={`${pokemon.name} official artwork`}
              width={160}
              height={160}
              priority={priority}
              className="mx-auto aspect-square group-hover:scale-110 transition-transform duration-300"
            />
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="outline" className={`w-full ${cardButtonHover}`} asChild>
          <Link href={`/pokemon/${pokemon.name}`} className="flex items-center justify-center">
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

/** Responsive grid of cards used by every list page. */
export function PokemonGrid({
  pokemon,
  priorityCount = 0,
}: {
  pokemon: readonly CardPokemon[];
  /** How many leading cards are above the fold and should load eagerly. */
  priorityCount?: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {pokemon.map((p, i) => (
        <PokemonCard key={p.id} pokemon={p} priority={i < priorityCount} />
      ))}
    </div>
  );
}
