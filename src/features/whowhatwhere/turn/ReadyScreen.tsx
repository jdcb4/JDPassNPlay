import { GamePanel } from "@/components/game/GamePanel";
import { IconArrowLeft } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { getActiveContext } from "@/domain/whowhatwhere/game";
import type { MatchState } from "@/domain/whowhatwhere/types";
import { LastTurnCard } from "@/features/whowhatwhere/summary/LastTurnCard";
import { Scoreboard } from "@/features/whowhatwhere/summary/Scoreboard";

const noticeClass = "text-sm text-muted-foreground";

export function ReadyScreen({
  match,
  error,
  handoffRevealed,
  onBackToSetup,
}: {
  readonly match: MatchState;
  readonly error: string;
  readonly handoffRevealed: boolean;
  readonly onBackToSetup: () => void;
}) {
  const context = getActiveContext(match);

  return (
    <section className="flex flex-1 flex-col pb-4">
      <GamePanel
        eyebrow={`Round ${Math.min(match.roundNumber, match.settings.totalRounds)} / ${match.settings.totalRounds}`}
        subtitle={`Give the phone to ${context.describer.name}`}
        title={`${context.team.name} up next`}
      >
        <div className="flex justify-end">
          <Button
            aria-label="Back to setup"
            size="icon"
            variant="ghost"
            onClick={onBackToSetup}
          >
            <IconArrowLeft className="size-5" aria-hidden="true" />
          </Button>
        </div>

        <LastTurnCard summary={match.lastTurnSummary} />
        <Scoreboard match={match} />

        <p className={noticeClass}>
          Word categories for this round:{" "}
          {match.settings.selectedCategories.join(", ")}.
        </p>

        <p className={noticeClass}>
          {handoffRevealed
            ? `${context.describer.name} has the phone. Start the timer from the footer when everyone is ready.`
            : `${context.describer.name} taps “Describer ready” in the footer when everyone else is looking away.`}
        </p>
      </GamePanel>

      {error ? (
        <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </section>
  );
}
