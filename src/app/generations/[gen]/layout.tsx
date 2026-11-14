import Link from "next/link";
import { Generations } from "@/assets/constants";

export default function GenerationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col justify-center px-4 py-12 text-center">
      <h1 className="my-2 text-4xl font-bold">Generations</h1>
      <nav
        aria-label="Generations"
        className="mx-auto flex max-w-[70%] flex-wrap justify-center gap-4 py-2"
      >
        {Generations.map((gen) => (
          <Link
            key={gen.name}
            className="min-w-[100px] items-center justify-center rounded-lg bg-purple-800 py-2 text-xl font-semibold text-white transition hover:bg-purple-700"
            href={`/generations/${gen.id}`}
          >
            {gen.name}
          </Link>
        ))}
      </nav>
      {children}
    </main>
  );
}
