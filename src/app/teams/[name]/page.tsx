import { notFound } from "next/navigation";
import Team from "@/components/teamsPage/Team";
import { USERNAME_PATTERN } from "@/lib/validation";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name: raw } = await params;
  // Usernames are plain [A-Za-z0-9_], so no URL-decoding is needed.
  const name = raw;
  if (!USERNAME_PATTERN.test(name)) notFound();

  return (
    <main className="mx-4 min-h-screen py-12">
      <h1 className="text-5xl font-semibold">{name}&apos;s Team</h1>
      <Team name={name} />
    </main>
  );
}
