"use client";

import { useState } from "react";
import { Pokemon, PokemonData } from "@/types/pokemonTypes";
import DefaultPokemon from "./DefaultPokemon";
import SearchedPokemon from "./SearchedPokemon";
import { toast } from "react-toastify";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, Loader2 } from "lucide-react";

// Each match costs one PokeAPI request; cap it so "a" doesn't fire ~1,000.
const MAX_RESULTS = 60;

export default function SearchForm({
  pokemon,
  allPokemon,
}: {
  pokemon: PokemonData[];
  allPokemon: Pokemon[];
}) {
  const [searchedPokemon, setSearchedPokemon] = useState<PokemonData[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getPokemonByName = async (rawName: string) => {
    const name = rawName.trim().toLowerCase().slice(0, 40);
    if (name.length > 1) {
      const matches = allPokemon.filter((pokemon) =>
        pokemon.name.includes(name),
      );
      if (matches.length > 0) {
        if (matches.length > MAX_RESULTS) {
          toast.info(
            `Showing the first ${MAX_RESULTS} of ${matches.length} matches. Try a more specific name.`,
          );
        }
        const results = await Promise.all(
          matches.slice(0, MAX_RESULTS).map(async (match) => {
            const res = await fetch(match.url);
            if (!res.ok) return null;
            return (await res.json()) as PokemonData;
          }),
        );
        return results.filter((p): p is PokemonData => p !== null);
      } else {
        toast.error(`No Pokémon with name "${search}" found`);
        setSearch("");
      }
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!search.trim()) return;
    
    setIsLoading(true);
    try {
      const pokemon = await getPokemonByName(search);
      if (pokemon) {
        setSearchedPokemon(pokemon);
        setSearch("");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSearchedPokemon([]);
    setSearch("");
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="search" className="sr-only">
              Search for a Pokémon
            </Label>
            <Input
              type="search"
              id="search"
              name="search"
              placeholder="Enter a Pokémon name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 text-lg"
              disabled={isLoading}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              type="submit" 
              size="lg" 
              disabled={isLoading || !search.trim()}
              className="flex items-center"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Search
            </Button>
            {searchedPokemon.length > 0 && (
              <Button 
                type="button" 
                variant="outline" 
                size="lg"
                onClick={handleClear}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </form>

      {searchedPokemon?.length === 0 ? (
        <DefaultPokemon pokemon={pokemon} />
      ) : (
        <SearchedPokemon pokemon={searchedPokemon} />
      )}
    </div>
  );
}