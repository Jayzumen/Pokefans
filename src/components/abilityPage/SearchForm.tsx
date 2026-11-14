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
    name = name.trim().toLowerCase().slice(0, 40);
    if (name.length > 1) {
      const ability = allAbilities?.filter((ability) =>
        ability.name.includes(name),
      );
      if (ability.length > 0) {
        if (ability.length > 60) {
          toast.info(`Showing the first 60 of ${ability.length} matches.`);
        }
        const res = await Promise.all(
          ability.slice(0, 60).map(async (ability) => {
            const res = await fetch(ability.url);
            return res.ok ? ((await res.json()) as AbilityData) : null;
          }),
        );
        return res.filter((a): a is AbilityData => a !== null);
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
