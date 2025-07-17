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

export interface Generation {
  id: string;
  name: string;
  pokemon_species: {
    name: string;
    url: string;
  }[];
  types: Type[];
  abilities: Ability[];
  moves: Move[];
  main_region: {
    name: string;
    url: string;
  };
  version_groups: {
    name: string;
    url: string;
  }[];
}
