"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllTeams, type Team } from "@/lib/teams";
import { Bone } from "../skeletons";
import { Button } from "../ui/button";
import TeamCard from "./TeamDisplay";

export function TeamSkeleton() {
  return (
    <div className="surface p-4 md:p-6">
      <Bone className="mb-4 h-5 w-32" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }, (_, i) => (
          <Bone key={i} className="aspect-[3/4] w-full rounded-[var(--radius)]" />
        ))}
      </div>
    </div>
  );
}

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
    return (
      <div className="space-y-6" aria-busy="true">
        <TeamSkeleton />
        <TeamSkeleton />
      </div>
    );
  }
  if (teams.length === 0) {
    return (
      <div className="surface flex flex-col items-center gap-4 px-6 py-16 text-center">
        <p className="text-lg font-medium">No teams yet</p>
        <p className="text-muted-foreground">Be the first trainer to share one.</p>
        <Button asChild className="rounded-full">
          <Link href="/login">Create your team</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {teams.map((t) => (
        <TeamCard key={t.uid} team={t} />
      ))}
    </div>
  );
}
