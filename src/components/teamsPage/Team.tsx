"use client";

import { useEffect, useState } from "react";
import { getTeamByUsername, type Team as TeamData } from "@/lib/teams";
import TeamDisplay from "./TeamDisplay";

export default function Team({ name }: { name: string }) {
  const [team, setTeam] = useState<TeamData | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    getTeamByUsername(name)
      .then((t) => active && setTeam(t))
      .catch(() => active && setTeam(null));
    return () => {
      active = false;
    };
  }, [name]);

  if (team === undefined) {
    return <p className="py-10 text-muted-foreground">Loading team…</p>;
  }
  if (!team || team.members.length === 0) {
    return (
      <p className="py-10 text-muted-foreground">
        No Pokémon in this team yet. Open any Pokémon and tap the heart to add
        it.
      </p>
    );
  }
  return <TeamDisplay members={team.members} />;
}
