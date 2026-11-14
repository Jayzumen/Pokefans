import { PokemonGrid } from "../PokemonCard";
import type { IndexPokemon } from "@/lib/pokemon-index";

export default function MovePokemon({ pokemon }: { pokemon: IndexPokemon[] }) {
  return (
    <>
      <p className="py-4 text-2xl font-bold">
        Pokémon that can learn this move ({pokemon.length})
      </p>
      <PokemonGrid pokemon={pokemon} />
    </>
  );
}
