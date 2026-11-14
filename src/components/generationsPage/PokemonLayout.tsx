import { PokemonTypes } from "@/assets/constants";
import PokemonCard, { CardPokemon } from "../PokemonCard";

function PokemonLayout({ data }: { data: CardPokemon[] }) {
  return (
    <div className="px-4">
      <div className="mx-auto grid grid-cols-1 gap-8 py-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        {[...data]
          .sort((a, b) => a.id - b.id)
          .map((pokemon) => {
            const matchingTypes = pokemon.types.map((type) => {
              return PokemonTypes.filter(
                (pokemonType) => pokemonType.name === type.type.name,
              )[0];
            });
            return (
              <PokemonCard
                key={pokemon.name}
                pokemonData={pokemon}
                matchingTypes={matchingTypes}
              />
            );
          })}
      </div>
    </div>
  );
}

export default PokemonLayout;
