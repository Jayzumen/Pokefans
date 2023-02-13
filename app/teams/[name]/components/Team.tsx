"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { collection, DocumentData, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase";
import TeamDisplay from "./TeamDisplay";

export default function Team({ name }: { name: string }) {
  const [teamData, setTeamData] = useState<DocumentData | undefined>([]);
  const path = usePathname();

  const getPokemonTeam = async (name: string) => {
    if (name) {
      const q = collection(db, "Teams", name, "pokemonTeam");
      const querySnapshot = await getDocs(q);
      const data: DocumentData = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      return data;
    }
  };

  useEffect(() => {
    const getTeamData = async () => {
      const data = await getPokemonTeam(name);
      setTeamData(data);
    };
    getTeamData();
  }, [path]);

  return <TeamDisplay teamData={teamData} />;
}
