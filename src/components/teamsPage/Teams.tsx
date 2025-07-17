"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { collection, DocumentData, getDocs } from "firebase/firestore";
import TeamsDisplay from "./TeamsDisplay";
import { db } from "@/lib/firebase";

export default function Teams() {
  const [teams, setTeams] = useState<DocumentData[]>([]);
  const path = usePathname();

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
        }),
      );
    });
    await Promise.all(teamData);
    return data;
  }

  useEffect(() => {
    getTeams()
      .then((data) => setTeams(data))
      .catch((err) => console.log(err));
  }, [path]);

  return <TeamsDisplay teams={teams} />;
}
