import SearchForm from "@/components/pokedexPage/SearchForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Database } from "lucide-react";

// Fully static: search runs in the browser against the bundled index.
export default function Pokedex() {
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
              Type a name or a dex number. Results update as you type.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SearchForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}