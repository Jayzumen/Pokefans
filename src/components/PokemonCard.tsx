import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Link from "next/link";
import { PokemonData } from "@/types/pokemonTypes";
import { PokemonTypes } from "@/assets/constants";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

interface PokemonCardProps {
  pokemonData: PokemonData;
  matchingTypes: {
    name: string;
    color: string;
  }[];
}

export default function PokemonCard(props: PokemonCardProps) {
  const { pokemonData, matchingTypes } = props;
  // if image not available, render no card
  if (!pokemonData.sprites.other["official-artwork"].front_default) {
    return;
  }

  return (
    <Card
      style={{
        background: `linear-gradient(180deg, ${
          matchingTypes?.[0]?.color
        } 0%, ${matchingTypes?.[1]?.color ? matchingTypes[1]?.color : "white"} 100%)`,
      }}
      className="border-2 border-black shadow-md shadow-black"
    >
      <CardHeader>
        <CardTitle>
          <p>
            #
            {pokemonData.id < 10
              ? `00${pokemonData.id}`
              : pokemonData.id < 100
                ? `0${pokemonData.id}`
                : pokemonData.id}
          </p>

          <p className="text-xl font-semibold capitalize">{pokemonData.name}</p>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Link href={`/pokemon/${pokemonData.name}`}>
          <Image
            src={pokemonData.sprites.other["official-artwork"].front_default}
            alt={pokemonData.name}
            width={200}
            height={200}
          />
        </Link>
      </CardContent>
      <CardFooter className="justify-center gap-4">
        {pokemonData.types.map((type) => {
          const matchingType = PokemonTypes.filter(
            (pokemonType) => pokemonType.name === type.type.name,
          )[0];
          return (
            <HoverCard key={type.type.name}>
              <HoverCardTrigger asChild>
                <Link
                  href={`/types/${type.type.name}`}
                  key={type.type.name}
                  style={{ backgroundColor: matchingType.color }}
                  className="rounded-full p-2 shadow-md shadow-black"
                >
                  <Image
                    src={`/typeImages/${type.type.name}.svg`}
                    alt={type.type.name}
                    height={25}
                    width={25}
                  />
                </Link>
              </HoverCardTrigger>
              <HoverCardContent className="w-32">
                <p className="text-center text-lg font-semibold">
                  {type.type.name}
                </p>
              </HoverCardContent>
            </HoverCard>
          );
        })}
      </CardFooter>
    </Card>
  );
}
