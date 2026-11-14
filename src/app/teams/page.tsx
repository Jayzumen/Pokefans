import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/layout";
import Teams from "@/components/teamsPage/Teams";

export const metadata: Metadata = {
  title: "Teams",
  description: "Teams of six built by the Pokéfans community.",
};

export default function TeamsPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Community"
        title="Teams"
        description="Every trainer can build a team of six. Here’s what the community picked."
      />
      <Container className="py-10">
        <Teams />
      </Container>
    </main>
  );
}
