import { PokemonTypes } from "@/assets/constants";
import { MoveData } from "../../../types/moveTypes";
import MoveInfo from "./MoveInfo";
import MovePokemon from "./MovePokemon";

async function getMoveData(id: string): Promise<MoveData> {
  const moveRes = await fetch(`https://pokeapi.co/api/v2/move/${id}`);
  const moveData: MoveData = await moveRes?.json();
  const pokemon = await Promise.all(
    moveData?.learned_by_pokemon?.map(async (pokemon: any) => {
      const pokemonRes = await fetch(pokemon?.url);
      const pokemonData = await pokemonRes?.json();
      return pokemonData;
    })
  );

  return { ...moveData, pokemon };
}

export async function generateStaticParams() {
  const res = await fetch("https://pokeapi.co/api/v2/move?limit=6");
  const data = await res?.json();
  const params = data.results.map((move: { name: string; url: string }) => ({
    id: move.name,
  }));
  return params;
}

export default async function movePage({ params }: { params: { id: string } }) {
  const move = await getMoveData(params?.id);

  const matchingType = PokemonTypes.filter(
    (pokemonType) => pokemonType.name === move.type.name
  )[0];

  if (move) {
    return (
      <main
        style={{
          backgroundColor: matchingType.color,
        }}
        className="min-h-screen px-4 pt-32 pb-4"
      >
        <MoveInfo move={move} />

        <MovePokemon move={move} />
      </main>
    );
  } else {
    return (
      <main className="px-4 pt-32 pb-4">
        <h1 className="my-2 text-4xl font-bold capitalize underline">
          Move not found
        </h1>
      </main>
    );
  }
}
