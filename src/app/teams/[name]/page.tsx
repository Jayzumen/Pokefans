import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, PageHeader } from "@/components/layout";
import Team from "@/components/teamsPage/Team";
import { USERNAME_PATTERN } from "@/lib/validation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  return { title: `${name}’s team` };
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  // Usernames are plain [A-Za-z0-9_], so no URL-decoding is needed.
  const { name } = await params;
  if (!USERNAME_PATTERN.test(name)) notFound();

  return (
    <main>
      <PageHeader eyebrow="Team" title={`${name}’s team`} />
      <Container className="py-10">
        <Team name={name} />
      </Container>
    </main>
  );
}
