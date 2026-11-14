"use client";

import { useEffect, useState } from "react";
import { getAllTeams, type Team } from "@/lib/teams";
import TeamsDisplay from "./TeamsDisplay";

export default function Teams() {
  const [teams, setTeams] = useState<Team[] | null>(null);

  useEffect(() => {
    let active = true;
    getAllTeams()
      .then((data) => active && setTeams(data))
      .catch(() => active && setTeams([]));
    return () => {
      active = false;
    };
  }, []);

  if (teams === null) {
    return <p className="py-10 text-muted-foreground">Loading teams…</p>;
  }
  if (teams.length === 0) {
    return <p className="py-10 text-muted-foreground">No teams yet.</p>;
  }
  return <TeamsDisplay teams={teams} />;
}
