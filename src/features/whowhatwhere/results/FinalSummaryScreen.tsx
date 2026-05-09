import { IconChevronRight } from "@/components/icons";
import { Button } from "@/components/ui/button";
import type { MatchState } from "@/domain/whowhatwhere/types";
import { LastTurnCard } from "@/features/whowhatwhere/summary/LastTurnCard";
import { Scoreboard } from "@/features/whowhatwhere/summary/Scoreboard";

export function FinalSummaryScreen({
  match,
  onViewResults,
}: {
  readonly match: MatchState;
  readonly onViewResults: () => void;
}) {
  return (
    <section className="flex flex-1 flex-col gap-5 pb-8">
      <div>
        <p className="text-sm font-medium text-primary">Final turn complete</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-normal">
          Match recap
        </h2>
      </div>

      <LastTurnCard summary={match.lastTurnSummary} />
      <Scoreboard match={match} />

      <Button className="mt-auto h-12" onClick={onViewResults} type="button">
        View final scores
        <IconChevronRight className="size-4" aria-hidden="true" />
      </Button>
    </section>
  );
}
