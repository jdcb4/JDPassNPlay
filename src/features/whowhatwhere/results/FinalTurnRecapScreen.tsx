import { FINAL_TURN_RECAP_NEXT_STEPS } from "@/components/game/finalTurnRecapCopy";
import { ReadyNextStepsCard } from "@/components/game/ReadyNextStepsCard";
import { ThatsTheLastTurnCard } from "@/components/game/ThatsTheLastTurnCard";
import type { MatchState } from "@/domain/whowhatwhere/types";
import { LastTurnCard } from "@/features/whowhatwhere/summary/LastTurnCard";

/** After the final timed turn: show last-turn performance before overall results (Who What Where). */
export function FinalTurnRecapScreen({
  match,
}: {
  readonly match: MatchState;
}) {
  return (
    <section className="flex flex-1 flex-col gap-4 pb-4">
      <ThatsTheLastTurnCard />
      <LastTurnCard summary={match.lastTurnSummary} />
      <ReadyNextStepsCard primaryText={FINAL_TURN_RECAP_NEXT_STEPS} />
    </section>
  );
}
