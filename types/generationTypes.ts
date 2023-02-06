import { Ability, Move, Stat, Type } from "./pokemonTypes";

export interface GenPokemonData {
  id: number;
  name: string;
  types: Type[];
  abilities: Ability[];
  is_default: boolean;
  species: {
    name: string;
    url: string;
  };
  moves: Move[];
  height: number;
  weight: number;
  stats: Stat[];
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
        front_shiny: string;
      };
    };
  };
}
