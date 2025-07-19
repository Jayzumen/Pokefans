import { PokemonTypes } from "@/assets/constants";
import { PokemonData } from "@/types/pokemonTypes";
import PokemonCard from "../PokemonCard";

export default function DefaultPokemon({
  pokemon,
}: {
  pokemon: PokemonData[];
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Featured Pokémon</h2>
        <p className="text-muted-foreground">
          Here are some popular Pokémon to get you started
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pokemon.map((pokemon) => {
          const matchingTypes = pokemon.types.map((type) => {
            return PokemonTypes.filter(
              (pokemonType) => pokemonType.name === type.type.name,
            )[0];
          });
          return (
            <PokemonCard
              key={pokemon.id}
              pokemonData={pokemon}
              matchingTypes={matchingTypes}
            />
          );
        })}
      </div>
    </div>
  );
}