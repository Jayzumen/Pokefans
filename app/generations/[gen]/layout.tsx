import Link from "next/link";
import { Generations } from "../../../assets/constants";

export default function GenerationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col justify-center bg-black text-center text-white`}
    >
      <p className="my-2 text-4xl font-bold underline">Generations</p>
      <div className="flex flex-wrap justify-center gap-4 py-2">
        {Generations.map((gen) => (
          <Link
            key={gen.name}
            className="min-w-[100px] items-center justify-center rounded-lg bg-purple-800 py-2 text-xl font-semibold transition hover:bg-purple-700"
            href={`/generations/${gen.id}`}
          >
            {gen.name}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
