import { EffectChange, EffectEntry, FlavorTextEntry } from "./abilityTypes";
import { Pokemon } from "./pokemonTypes";

export interface Move {
  name: string;
  url: string;
}

export interface MoveData {
  accuracy: number;
  effect_chance: number;
  pp: number;
  priority: number;
  damage_class: {
    name: string;
    url: string;
  };
  power: number;
  type: {
    name: string;
    url: string;
  };
  id: number;
  name: string;
  learned_by_pokemon: Pokemon[];
  effect_entries: EffectEntry[];
  flavor_text_entries: FlavorTextEntry[];
  effect_changes: EffectChange[];
}
