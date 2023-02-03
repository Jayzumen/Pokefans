import Link from "next/link";
import SearchForm from "./SearchForm";

export default function AbilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col justify-center bg-black text-center text-white`}
    >
      <h1 className="my-2 text-4xl font-bold capitalize underline">
        Ability-Dex
      </h1>

      <SearchForm />

      {children}
    </div>
  );
}
