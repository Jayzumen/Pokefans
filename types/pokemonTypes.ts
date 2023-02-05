export interface Pokemon {
  name: string;
  url: string;
}

export interface PokemonData {
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
  speciesData: Species;
  evoChainData: EvolutionChain | undefined;
}

export interface Species {
  name: string;
  id: number;
  evolution_chain: {
    url: string;
  };
  evolves_from_species: {
    name: string;
    url: string;
  };
  flavor_text_entries: FlavorTextEntry[];
  is_legendary: boolean;
  is_mythical: boolean;
  is_baby: boolean;
  varieties: Variety[];
}

export interface EvolutionChain {
  id: number;
  chain: Chain;
  baby_trigger_item: {
    name: string;
    url: string;
  };
}

export interface Chain {
  is_baby: boolean;
  species: {
    name: string;
    url: string;
  };
  evolves_to: Chain[];
  evolution_details: EvolutionDetail[];
}

export interface EvolutionDetail {
  gender: number;
  held_item: {
    name: string;
    url: string;
  };
  item: {
    name: string;
    url: string;
  };
  known_move: {
    name: string;
    url: string;
  };
  known_move_type: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  min_affection: number;
  min_beauty: number;
  min_happiness: number;
  min_level: number;
  needs_overworld_rain: boolean;
  party_species: {
    name: string;
    url: string;
  };
  party_type: {
    name: string;
    url: string;
  };
  relative_physical_stats: number;
  time_of_day: string;
  trade_species: {
    name: string;
    url: string;
  };
  trigger: {
    name: string;
    url: string;
  };
  turn_upside_down: boolean;
}

export interface Variety {
  is_default: boolean;
  pokemon: {
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
  version: {
    name: string;
    url: string;
  };
}

export interface Ability {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface Move {
  move: {
    name: string;
    url: string;
  };
  version_group_details: VersionGroupDetail[];
}

export interface Stat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface Type {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface VersionGroupDetail {
  level_learned_at: number;
  move_learn_method: {
    name: string;
    url: string;
  };
  version_group: {
    name: string;
    url: string;
  };
}
