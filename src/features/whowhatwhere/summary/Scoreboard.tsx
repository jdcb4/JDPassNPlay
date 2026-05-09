import type { MatchState } from "@/domain/whowhatwhere/types";

export function Scoreboard({ match }: { readonly match: MatchState }) {
  const activeTeamId = match.teamOrder[match.teamIndex];
  const leaderboard = [...match.teams].sort((left, right) => right.score - left.score);

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Leaderboard</h3>
        <p className="text-sm text-muted-foreground">
          {match.stage === "finalSummary" ? "Final" : "Live"}
        </p>
      </div>
      {leaderboard.map((team, index) => (
        <div
          key={team.id}
          className={`flex items-center justify-between rounded-md border bg-card p-4 ${
            team.id === activeTeamId ? "ring-2 ring-ring" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <p className="w-8 text-sm font-semibold text-muted-foreground">
              #{index + 1}
            </p>
            <p className="font-semibold">{team.name}</p>
          </div>
          <p className="text-2xl font-bold">{team.score}</p>
        </div>
      ))}
    </div>
  );
}
