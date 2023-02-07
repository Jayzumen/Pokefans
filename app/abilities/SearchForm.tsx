"use client";

import { Ability, AbilityData } from "@/types/abilityTypes";
import { useState } from "react";
import DefaultAbility from "./DefaultAbility";
import SearchedAbility from "./SearchedAbility";

export default function SearchForm({
  randomAbility,
  allAbilities,
}: {
  randomAbility: AbilityData[];
  allAbilities: Ability[];
}) {
  const [searchedAbility, setSearchedAbility] = useState<AbilityData[]>([]);
  const [search, setSearch] = useState("");

  const getSearchedAbility = async (name: string) => {
    if (name.length > 1) {
      const ability = allAbilities?.filter((ability) =>
        ability.name.includes(name.toLowerCase())
      );
      if (ability) {
        const res: AbilityData[] = await Promise.all(
          ability?.map(async (ability) => {
            const res = await fetch(ability.url);
            const data: AbilityData = await res?.json();
            return data;
          })
        );
        return res;
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ability = await getSearchedAbility(search);

    if (ability) {
      setSearchedAbility(ability);
      setSearch("");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-10 flex max-w-[500px] flex-col gap-y-4 px-2 text-xl"
      >
        <label htmlFor="search">Search for an Ability</label>
        <input
          className="rounded-full px-4 py-2 text-black shadow-md shadow-sky-700 outline-none"
          type="search"
          id="search"
          name="search"
          placeholder="Enter a Ability..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="submit"
          className="mx-auto w-fit rounded-md bg-purple-900 py-2 px-6 text-white transition hover:bg-slate-300 hover:text-black disabled:bg-sky-700 disabled:text-gray-200"
        >
          Search
        </button>
      </form>
      {searchedAbility?.length === 0 ? (
        <DefaultAbility randomAbilityData={randomAbility} />
      ) : (
        <SearchedAbility searchedAbilityData={searchedAbility} />
      )}
    </>
  );
}
