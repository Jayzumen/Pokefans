"use client";

export default function SearchForm() {
  // async function getAllAbilities(): Promise<Ability[]> {
  //   const res = await fetch("https://pokeapi.co/api/v2/ability?limit=358");
  //   const data = await res.json();
  //   return data.results;
  // }

  // async function getSearchedAbilities(search: string): Promise<AbilityData[]> {
  //   const searchedAbilities = await getAllAbilities();
  //   const filteredAbilities = searchedAbilities.filter((ability) =>
  //     ability.name.toLowerCase().includes(search)
  //   );
  //   const filteredData = await Promise.all(
  //     filteredAbilities.map(async (ability) => {
  //       const res = await fetch(ability.url);
  //       const data = await res.json();
  //       return data;
  //     })
  //   );
  //   return filteredData;
  // }

  return (
    <form className="mx-auto mt-10 flex max-w-[500px] flex-col gap-y-4 px-2 text-xl">
      <label htmlFor="search">Search for an Ability</label>
      <input
        className="rounded-full px-4 py-2 text-black shadow-md shadow-sky-700 outline-none"
        type="search"
        id="search"
        name="search"
        placeholder="Enter a Ability..."
      />
      <button
        type="submit"
        className="mx-auto w-fit rounded-md bg-purple-900 py-2 px-6 text-white transition hover:bg-slate-300 hover:text-black disabled:bg-sky-700 disabled:text-gray-200"
      >
        Search
      </button>
    </form>
  );
}
