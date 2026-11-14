"use client";

import { useEffect, useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../auth-provider";
import { getTeam, toggleTeamMember, type TeamMember } from "@/lib/teams";
import { cn } from "@/lib/utils";

export default function AddToTeamButton({ member }: { member: TeamMember }) {
  const { user, profile } = useAuth();
  // Remember which user the saved state belongs to, so it resets on sign-out.
  const [saved, setSaved] = useState<{ uid: string; value: boolean } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
  const isSaved = !!user && saved?.uid === user.uid && saved.value;

  useEffect(() => {
    if (!user) return;
    let active = true;
    getTeam(user.uid)
      .then((team) => {
        if (active) {
          setSaved({
            uid: user.uid,
            value: !!team?.members.some((m) => m.id === member.id),
          });
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [user, member.id]);

  const handleClick = async () => {
    if (!user || !profile) {
      toast("Sign in to save Pokémon to your team.");
      return;
    }
    setBusy(true);
    try {
      const result = await toggleTeamMember(user.uid, profile.username, member);
      if (result === "full") {
        toast("Your team already has 6 Pokémon. Remove one first.");
      } else {
        setSaved({ uid: user.uid, value: result === "added" });
        toast(
          result === "added"
            ? `${member.name} added to your team`
            : `${member.name} removed from your team`,
        );
      }
    } catch {
      toast.error("Couldn't update your team. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      aria-pressed={isSaved}
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-medium",
        "transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.97] disabled:opacity-60",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none",
        isSaved
          ? "border-transparent bg-primary text-primary-foreground hover:bg-primary/90"
          : "border-border bg-card text-foreground hover:border-primary/50 hover:text-primary",
      )}
    >
      {busy ? (
        <Loader2 aria-hidden className="size-4 animate-spin" />
      ) : (
        <Heart
          aria-hidden
          className="size-4"
          fill={isSaved ? "currentColor" : "none"}
        />
      )}
      <span className="capitalize">
        {isSaved ? "In your team" : "Add to team"}
      </span>
    </button>
  );
}
