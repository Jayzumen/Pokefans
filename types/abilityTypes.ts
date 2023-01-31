export interface AbilityData {
  name: string;
  id: number;
  effect_entries: EffectEntry[];
  pokemon: Pokemon[];
  flavor_text_entries: FlavorTextEntry[];
  generation: {
    name: string;
    url: string;
  };
  is_main_series: boolean;
  effect_changes: EffectChange[];
}

export interface EffectEntry {
  effect: string;
  language: {
    name: string;
    url: string;
  };
  short_effect: string;
}

export interface EffectChange {
  effect_entries: EffectEntry[];
  version_group: {
    name: string;
    url: string;
  };
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: {
    name: string;
    url: string;
  };
  version_group: {
    name: string;
    url: string;
  };
}

export interface Pokemon {
  is_hidden: boolean;
  pokemon: {
    name: string;
    url: string;
  };
  slot: number;
}
