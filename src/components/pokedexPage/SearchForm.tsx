"use client";

import { useState } from "react";
import { Pokemon, PokemonData, Species } from "@/types/pokemonTypes";
import DefaultPokemon from "./DefaultPokemon";
import SearchedPokemon from "./SearchedPokemon";
import { toast } from "react-toastify";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, Loader2 } from "lucide-react";

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

  const getPokemonByName = async (name: string) => {
    if (name.length > 1) {
      const pokemon = allPokemon.filter((pokemon) =>
        pokemon.name.includes(name.toLowerCase()),
      );
      if (pokemon.length > 0) {
        const res: PokemonData[] = await Promise.all(
          pokemon?.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            const data: PokemonData = await res?.json();
            const speciesRes = await fetch(data.species.url);
            const speciesData: Species = await speciesRes?.json();
            return { ...data, speciesData };
          }),
        );
        return res;
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