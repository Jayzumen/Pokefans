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
import { Eye, Heart } from "lucide-react";

interface PokemonCardProps {
  pokemonData: PokemonData;
  matchingTypes: {
    name: string;
    color: string;
  }[];
}

export default function PokemonCard(props: PokemonCardProps) {
  const { pokemonData, matchingTypes } = props;

  return (
    <Card className="pokemon-card-hover group overflow-hidden border-2 hover:border-primary/20 bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground font-mono">
            #{pokemonData.id.toString().padStart(3, '0')}
          </div>
          <Button size="icon" variant="ghost" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
            <Heart className="h-4 w-4" />
          </Button>
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
          <Link href={`/pokemon/${pokemonData.name}`}>
            <Image
              src={pokemonData.sprites.other["official-artwork"].front_default}
              alt={pokemonData.name}
              width={160}
              height={160}
              className="mx-auto group-hover:scale-110 transition-transform duration-300"
            />
          </Link>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2">
          {pokemonData.types.map((type) => {
            const matchingType = PokemonTypes.filter(
              (pokemonType) => pokemonType.name === type.type.name,
            )[0];
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
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" 
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