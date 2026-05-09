import type { MatchState } from "@/domain/whowhatwhere/types";
import { LastTurnCard } from "@/features/whowhatwhere/summary/LastTurnCard";
import { Scoreboard } from "@/features/whowhatwhere/summary/Scoreboard";

export function FinalSummaryScreen({
  match,
}: {
  readonly match: MatchState;
}) {
  return (
    <section className="flex flex-1 flex-col gap-5 pb-4">
      <div>
        <p className="text-sm font-medium text-primary">Final turn complete</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-normal">
          Match recap
        </h2>
      </div>

      <LastTurnCard summary={match.lastTurnSummary} />
      <Scoreboard match={match} />
    </section>
  );
}
