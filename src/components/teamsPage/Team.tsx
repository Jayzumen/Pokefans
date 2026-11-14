"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTeamByUsername, type Team as TeamData } from "@/lib/teams";
import { Button } from "../ui/button";
import TeamCard from "./TeamDisplay";
import { TeamSkeleton } from "./Teams";

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

  if (team === undefined) return <TeamSkeleton />;

  if (!team || team.members.length === 0) {
    return (
      <div className="surface flex flex-col items-center gap-4 px-6 py-16 text-center">
        <p className="text-lg font-medium">No Pokémon in this team yet</p>
        <p className="max-w-md text-muted-foreground">
          Open any Pokémon and press “Add to team” to start building it.
        </p>
        <Button asChild className="rounded-full">
          <Link href="/pokedex">Browse the Pokédex</Link>
        </Button>
      </div>
    );
  }
  return <TeamCard team={team} showHeader={false} />;
}
