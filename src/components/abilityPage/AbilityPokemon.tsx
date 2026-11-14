import { PokemonGrid } from "../PokemonCard";
import type { IndexPokemon } from "@/lib/pokemon-index";

export default function AbilityPokemon({ pokemon }: { pokemon: IndexPokemon[] }) {
  return (
    <>
      <p className="py-4 text-2xl font-bold">
        Pokémon with this ability ({pokemon.length})
      </p>
      <PokemonGrid pokemon={pokemon} />
    </>
  );
}
