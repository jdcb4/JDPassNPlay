import { GamePanel } from "@/components/game/GamePanel";
import type { MatchState } from "@/domain/whowhatwhere/types";
import { LastTurnCard } from "@/features/whowhatwhere/summary/LastTurnCard";
import { Scoreboard } from "@/features/whowhatwhere/summary/Scoreboard";

export function FinalSummaryScreen({
  match,
}: {
  readonly match: MatchState;
}) {
  return (
    <section className="flex flex-1 flex-col pb-4">
      <GamePanel eyebrow="Final turn complete" title="Match recap">
        <LastTurnCard summary={match.lastTurnSummary} />
        <Scoreboard match={match} />
      </GamePanel>
    </section>
  );
}
