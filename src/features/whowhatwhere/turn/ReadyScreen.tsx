import { GamePanel } from "@/components/game/GamePanel";
import { IconArrowLeft } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { getActiveContext } from "@/domain/whowhatwhere/game";
import type { MatchState } from "@/domain/whowhatwhere/types";
import { LastTurnCard } from "@/features/whowhatwhere/summary/LastTurnCard";
import { Scoreboard } from "@/features/whowhatwhere/summary/Scoreboard";

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
    <section className="flex flex-1 flex-col gap-5 pb-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">
          Round {Math.min(match.roundNumber, match.settings.totalRounds)} /{" "}
          {match.settings.totalRounds}
        </p>
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

      <GamePanel
        eyebrow="Pass to describer"
        title={
          handoffRevealed
            ? `${context.team.name} are live when you start`
            : `Give the phone to ${context.describer.name}`
        }
        {...(!handoffRevealed
          ? {
              subtitle: `${context.team.name} up next — ${context.describer.name} taps ready when everyone else is looking away.`,
            }
          : {})}
      >
        {!handoffRevealed ? (
          <p className="text-sm leading-6 text-muted-foreground">
            Only the describer should see the next steps after tapping{" "}
            <span className="font-medium text-foreground">Describer ready</span>{" "}
            in the bar below.
          </p>
        ) : (
          <p className="rounded-lg border border-border bg-muted/20 p-3 text-sm">
            When everyone is ready, start the timer from the footer.
          </p>
        )}
      </GamePanel>

      {error ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </section>
  );
}
