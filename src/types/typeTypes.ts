import { PokemonData } from "./pokemonTypes";

export interface TypeData {
  id: number;
  name: string;
  damage_relations: DamageRelations;
  moves: Move[];
  pokemon: Pokemon[];
  pokemonData: PokemonData[];
}

export interface Pokemon {
  pokemon: {
    name: string;
    url: string;
  };
  slot: number;
}

export interface Type2 {
  type: {
    name: string;
    url: string;
  };
  slot: number;
}

export interface Type {
  name: string;
  url: string;
}

export interface DamageRelations {
  double_damage_from: Type[];
  double_damage_to: Type[];
  half_damage_from: Type[];
  half_damage_to: Type[];
  no_damage_from: Type[];
  no_damage_to: Type[];
}

export interface Move {
  name: string;
  url: string;
}
