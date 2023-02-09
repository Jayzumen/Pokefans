import TeamsDisplay from "./TeamsDisplay";

export default async function TeamsPage() {
  return (
    <main className="min-h-screen px-4 pt-32 pb-4">
      <h1 className="text-4xl font-semibold underline">Teams</h1>
      <TeamsDisplay />
    </main>
  );
}
