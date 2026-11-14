import { buildLearnsets } from "@/lib/learnset";
import type { Move } from "@/types/pokemonTypes";
import MovesExplorer from "./MovesExplorer";

/**
 * Server wrapper: reduces the raw PokeAPI move list to a compact
 * game -> method -> moves structure, then hands it to the client explorer.
 */
export default function Moves({ moves }: { moves: Move[] }) {
  return <MovesExplorer data={buildLearnsets(moves)} />;
}
