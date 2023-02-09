import { collection, DocumentData, getDocs } from "firebase/firestore";
import { db } from "./../firebase";
import TeamsDisplay from "./TeamsDisplay";

async function getTeams() {
  const teamsRef = collection(db, "Teams");
  const querySnapshot = await getDocs(teamsRef);
  const data: DocumentData[] = [];
  const teamData: DocumentData[] = [];
  querySnapshot.forEach(async (doc) => {
    const pokemonTeamRef = collection(db, "Teams", doc.id, "pokemonTeam");
    teamData.push(
      getDocs(pokemonTeamRef).then((pokemonTeamSnapshot) => {
        const pokemonTeamData: DocumentData = [];
        pokemonTeamSnapshot.forEach((pokemonDoc) => {
          pokemonTeamData.push(pokemonDoc.data());
        });
        data.push({
          userId: doc.id,
          pokemonTeam: pokemonTeamData,
        });
      })
    );
  });
  await Promise.all(teamData);
  return data;
}

export default async function TeamsPage() {
  const teams = await getTeams();
  return (
    <main className="px-4 pt-32 pb-4">
      <h1 className="text-4xl font-semibold underline">Teams</h1>
      <TeamsDisplay teams={teams} />
    </main>
  );
}
