import { EffectChange, EffectEntry, FlavorTextEntry } from "./abilityTypes";
import { Pokemon } from "./pokemonTypes";

export interface Attack {
  name: string;
  url: string;
}

export interface AttackData {
  accuracy: number;
  effect_chance: number;
  pp: number;
  priority: number;
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
