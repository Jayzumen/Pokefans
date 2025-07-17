import Teams from "@/components/teamsPage/Teams";

export default async function TeamsPage() {
  return (
    <main className="min-h-screen px-4 pt-32 pb-4">
      <h1 className="text-4xl font-semibold underline">Teams</h1>
      <Teams />
    </main>
  );
}
