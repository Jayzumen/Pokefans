import { PokemonData } from "@/types/pokemonTypes";
import { PokemonTypes } from "@/assets/constants";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight, Star } from "lucide-react";

interface FeaturedPokemonProps {
  randomPokemon: PokemonData[];
}

export default function FeaturedPokemon({ randomPokemon }: FeaturedPokemonProps) {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Star className="w-6 h-6 text-primary mr-2" />
            <span className="text-primary font-semibold">Featured</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Discover Amazing Pokémon
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet some incredible Pokémon from our vast database. Each one has unique abilities and characteristics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {randomPokemon.map((pokemon, index) => {
            const matchingTypes = pokemon.types.map((type) => {
              return PokemonTypes.filter(
                (pokemonType) => pokemonType.name === type.type.name,
              )[0];
            });

            return (
              <Card 
                key={index} 
                className="pokemon-card-hover group overflow-hidden border-2 hover:border-primary/20"
                style={{
                  background: `linear-gradient(135deg, ${matchingTypes[0]?.color}15 0%, ${
                    matchingTypes[1] ? matchingTypes[1]?.color + "15" : matchingTypes[0]?.color + "15"
                  } 100%)`,
                }}
              >
                <CardHeader className="text-center pb-2">
                  <div className="text-sm text-muted-foreground font-mono">
                    #{pokemon.id.toString().padStart(3, '0')}
                  </div>
                  <CardTitle className="text-xl capitalize">{pokemon.name}</CardTitle>
                </CardHeader>
                
                <CardContent className="text-center">
                  <div className="relative mb-4">
                    <Link href={`/pokemon/${pokemon.name}`}>
                      <Image
                        src={pokemon.sprites.other["official-artwork"].front_default}
                        alt={pokemon.name}
                        width={200}
                        height={200}
                        className="mx-auto group-hover:scale-110 transition-transform duration-300"
                      />
                    </Link>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {pokemon.types.map((type) => {
                      const matchingType = PokemonTypes.filter(
                        (pokemonType) => pokemonType.name === type.type.name,
                      )[0];
                      return (
                        <Badge
                          key={type.type.name}
                          variant="secondary"
                          className="capitalize"
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
                  
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground" asChild>
                    <Link href={`/pokemon/${pokemon.name}`} className="flex items-center justify-center">
                      View Details
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button size="lg" asChild>
            <Link href="/pokedex" className="flex items-center">
              Explore All Pokémon
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}