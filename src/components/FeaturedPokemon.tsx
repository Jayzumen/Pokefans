import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { artworkUrl, formatDexNumber } from "@/lib/pokemon";
import type { IndexPokemon } from "@/lib/pokemon-index";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { cardButtonHover, colorOfType, TypeBadge } from "./PokemonCard";

export default function FeaturedPokemon({ pokemon }: { pokemon: IndexPokemon[] }) {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Star className="w-6 h-6 text-primary mr-2" />
            <span className="text-primary font-semibold">Pokémon of the day</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Discover Amazing Pokémon
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A fresh selection every day. Each one has unique abilities and
            characteristics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {pokemon.map((p) => {
            const [first, second = first] = p.types.map(colorOfType);
            return (
              <Card
                key={p.id}
                className="pokemon-card-hover group overflow-hidden border-2 hover:border-primary/20"
                style={{
                  background: `linear-gradient(135deg, ${first}15 0%, ${second}15 100%)`,
                }}
              >
                <CardHeader className="text-center pb-2">
                  <div className="text-sm text-muted-foreground font-mono">
                    {formatDexNumber(p.id)}
                  </div>
                  <CardTitle className="text-xl capitalize">{p.name}</CardTitle>
                </CardHeader>

                <CardContent className="text-center">
                  <div className="relative mb-4">
                    <Link href={`/pokemon/${p.name}`} tabIndex={-1} aria-hidden="true">
                      <Image
                        src={artworkUrl(p.id)}
                        alt={`${p.name} official artwork`}
                        width={200}
                        height={200}
                        className="mx-auto aspect-square group-hover:scale-110 transition-transform duration-300"
                      />
                    </Link>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {p.types.map((type) => (
                      <TypeBadge key={type} type={type} />
                    ))}
                  </div>

                  <Button variant="outline" className={`w-full ${cardButtonHover}`} asChild>
                    <Link href={`/pokemon/${p.name}`} className="flex items-center justify-center">
                      View Details
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
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
