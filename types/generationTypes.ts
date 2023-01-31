export interface Generation {
  abilities: {
    name: string;
    url: string;
  }[];
  id: number;
  main_region: {
    name: string;
    url: string;
  };
  moves: {
    name: string;
    url: string;
  }[];
  name: string;
  names: Name[];
  pokemon_species: {
    name: string;
    url: string;
  }[];
  version_groups: {
    name: string;
    url: string;
  }[];
}

export interface GenerationPokemon {
  id: number;
  name: string;
}

export interface AllGenerations {
  count: number;
  next: string;
  previous: string;
  results: {
    name: string;
    url: string;
  }[];
}

export interface Name {
  language: {
    name: string;
    url: string;
  };
  name: string;
}
