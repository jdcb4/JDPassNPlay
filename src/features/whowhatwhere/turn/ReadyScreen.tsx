import { useState } from "react";

import { IconArrowLeft } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { getActiveContext } from "@/domain/whowhatwhere/game";
import type { MatchState } from "@/domain/whowhatwhere/types";
import { LastTurnCard } from "@/features/whowhatwhere/summary/LastTurnCard";
import { Scoreboard } from "@/features/whowhatwhere/summary/Scoreboard";

export function ReadyScreen({
  match,
  error,
  isLoading,
  onStartTurn,
  onBackToSetup,
}: {
  readonly match: MatchState;
  readonly error: string;
  readonly isLoading: boolean;
  readonly onStartTurn: () => void;
  readonly onBackToSetup: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const context = getActiveContext(match);

  return (
    <section className="flex flex-1 flex-col gap-5 pb-8">
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

      <div className="mt-auto rounded-md border bg-card p-4 shadow-sm">
        {!revealed ? (
          <div className="grid gap-4">
            <div>
              <p className="text-sm font-medium text-primary">Pass to describer</p>
              <p className="mt-1 text-sm font-semibold text-muted-foreground">
                {context.team.name} up next
              </p>
              <h3 className="mt-1 text-xl font-semibold">
                Give the phone to {context.describer.name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {context.describer.name} taps ready when everyone else is looking
                away.
              </p>
            </div>
            <Button className="h-12" onClick={() => setRevealed(true)}>
              Describer ready
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            <p className="rounded-md bg-secondary p-3 text-sm">
              {context.team.name} are live when you start.
            </p>
            <Button className="h-12" disabled={isLoading} onClick={onStartTurn}>
              {isLoading ? "Loading words" : "Start turn"}
            </Button>
          </div>
        )}
      </div>

      {error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}
    </section>
  );
}
