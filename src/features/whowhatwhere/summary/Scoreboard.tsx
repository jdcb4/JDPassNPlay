import { GameScoreboard } from "@/components/game/GameScoreboard";
import type { MatchState } from "@/domain/whowhatwhere/types";

export function Scoreboard({ match }: { readonly match: MatchState }) {
  const activeTeamId = match.teamOrder[match.teamIndex];

  return (
    <GameScoreboard
      {...(activeTeamId ? { activeTeamId } : {})}
      sortDescendingByScore
      teams={match.teams.map((team) => ({
        id: team.id,
        name: team.name,
        score: team.score,
      }))}
    />
  );
}
