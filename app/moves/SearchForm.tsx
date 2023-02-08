"use client";

import { Move, MoveData } from "@/types/moveTypes";
import { useState } from "react";
import { toast } from "react-toastify";
import DefaultMoves from "./DefaultMoves";
import SearchedMoves from "./SearchedMoves";

export default function SearchForm({
  randomMoveData,
  allMoves,
}: {
  randomMoveData: MoveData[];
  allMoves: Move[];
}) {
  const [searchedMove, setSearchedMove] = useState<MoveData[]>([]);
  const [search, setSearch] = useState("");

  const getSearchedMove = async (name: string) => {
    if (name.length > 1) {
      const move = allMoves?.filter((move) =>
        move.name.includes(name.toLowerCase())
      );
      if (move.length > 0) {
        const res: MoveData[] = await Promise.all(
          move?.map(async (move) => {
            const res = await fetch(move.url);
            const data: MoveData = await res?.json();
            return data;
          })
        );
        return res;
      } else {
        toast.error(`No Move with name "${search}" found`);
        setSearch("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const move = await getSearchedMove(search);

    if (move) {
      setSearchedMove(move);
      setSearch("");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-10 pb-4 flex max-w-[500px] flex-col gap-y-4 p-2 text-xl"
      >
        <label htmlFor="search">Search for a Move</label>
        <input
          className="rounded-full px-4 py-2 text-black shadow-md shadow-sky-700 outline-none"
          type="search"
          id="search"
          name="search"
          placeholder="Enter a Move..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="rounded-full bg-sky-700 px-4 py-2 text-white shadow-md shadow-sky-700 outline-none"
          type="submit"
        >
          Search
        </button>
      </form>
      {searchedMove?.length === 0 ? (
        <DefaultMoves randomMoveData={randomMoveData} />
      ) : (
        <SearchedMoves searchedMoves={searchedMove} />
      )}
    </>
  );
}
