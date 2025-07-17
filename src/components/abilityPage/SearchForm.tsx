"use client";

import { Ability, AbilityData } from "@/types/abilityTypes";
import { useState } from "react";
import { toast } from "react-toastify";
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
        ability.name.includes(name.toLowerCase()),
      );
      if (ability.length > 0) {
        const res: AbilityData[] = await Promise.all(
          ability?.map(async (ability) => {
            const res = await fetch(ability.url);
            const data: AbilityData = await res?.json();
            return data;
          }),
        );
        return res;
      } else {
        toast.error(`No Ability with name "${search}" found`);
        setSearch("");
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
        className="mx-auto mt-10 flex max-w-[500px] flex-col gap-y-4 px-2 pb-4 text-xl"
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
          className="rounded-full bg-sky-700 px-4 py-2 text-white shadow-md shadow-sky-700 outline-none"
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
