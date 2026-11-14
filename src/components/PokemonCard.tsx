import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { PokemonData } from "@/types/pokemonTypes";
import { PokemonTypes } from "@/assets/constants";
import { Button } from "./ui/button";
import { Eye } from "lucide-react";
import { formatDexNumber } from "@/lib/pokemon";

/** The minimal Pokémon shape a card needs. */
export type CardPokemon = Pick<PokemonData, "id" | "name" | "sprites" | "types">;

interface PokemonCardProps {
  pokemonData: CardPokemon;
  matchingTypes: {
    name: string;
    color: string;
  }[];
}

export default function PokemonCard(props: PokemonCardProps) {
  const { pokemonData, matchingTypes } = props;
  const artwork = pokemonData.sprites.other["official-artwork"].front_default;
  // if image not available, render no card
  if (!artwork) {
    return null;
  }

  return (
    <Card className="pokemon-card-hover group overflow-hidden border-2 hover:border-primary/20 bg-card">
      <CardHeader className="pb-2">
        <div className="text-sm text-muted-foreground font-mono">
          {formatDexNumber(pokemonData.id)}
        </div>
        <CardTitle className="text-xl capitalize">{pokemonData.name}</CardTitle>
      </CardHeader>

      <CardContent className="text-center pb-2">
        <div className="relative mb-4 p-4 rounded-lg"
          style={{
            background: `linear-gradient(135deg, ${matchingTypes?.[0]?.color}15 0%, ${
              matchingTypes?.[1]?.color ? matchingTypes[1]?.color + "15" : matchingTypes?.[0]?.color + "15"
            } 100%)`,
          }}
        >
          <Link href={`/pokemon/${pokemonData.name}`} tabIndex={-1} aria-hidden="true">
            <Image
              src={artwork}
              alt={`${pokemonData.name} official artwork`}
              width={160}
              height={160}
              className="mx-auto group-hover:scale-110 transition-transform duration-300"
            />
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {pokemonData.types.map((type) => {
            const matchingType = PokemonTypes.find(
              (pokemonType) => pokemonType.name === type.type.name,
            );
            return (
              <Badge
                key={type.type.name}
                variant="secondary"
                className="capitalize text-xs"
                style={{
                  backgroundColor: matchingType?.color + "20",
                  color: matchingType?.color,
                  borderColor: matchingType?.color + "40",
                }}
              >
                {type.type.name}
              </Badge>
            );
          })}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          variant="outline"
          className="w-full group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground dark:group-hover:border-primary dark:group-hover:bg-primary dark:hover:border-primary dark:hover:bg-primary"
          asChild
        >
          <Link href={`/pokemon/${pokemonData.name}`} className="flex items-center justify-center">
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
