import SearchForm from "@/components/pokedexPage/SearchForm";
import { Pokemon, PokemonData } from "@/types/pokemonTypes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Database } from "lucide-react";
import { pokeapi } from "@/lib/pokeapi";

async function getDefaultPokemon() {
  return Promise.all(
    Array.from({ length: 9 }, (_, i) =>
      pokeapi<PokemonData>(`pokemon/${i + 1}`),
    ),
  );
}

async function getAllPokemon() {
  const data = await pokeapi<{ results: Pokemon[] }>("pokemon?limit=10500");
  return data.results;
}

export default async function Pokedex() {
  const [defaultPokemon, allPokemon] = await Promise.all([
    getDefaultPokemon(),
    getAllPokemon(),
  ]);
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Database className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              Pokédex
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover and explore detailed information about all Pokémon. Search by name, type, or generation.
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-12 border-2 border-primary/10 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Search className="w-6 h-6 text-primary mr-2" />
              <CardTitle className="text-2xl">Search Pokémon</CardTitle>
            </div>
            <CardDescription className="text-base">
              Find your favorite Pokémon by typing their name below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SearchForm pokemon={defaultPokemon} allPokemon={allPokemon} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}