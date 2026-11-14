import { PokemonGrid } from "../PokemonCard";
import type { IndexPokemon } from "@/lib/pokemon-index";

export default function TypePokemon({ pokemon }: { pokemon: IndexPokemon[] }) {
  return (
    <div className="my-4">
      <h2 className="my-2 text-2xl font-bold">
        Pokémon with this type ({pokemon.length})
      </h2>
      <PokemonGrid pokemon={pokemon} />
    </div>
  );
}
