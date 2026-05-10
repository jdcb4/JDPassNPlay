import { BetweenTurnsLayout } from "@/components/game/BetweenTurnsLayout";
import { GamePanel } from "@/components/game/GamePanel";
import { ReadyNextStepsCard } from "@/components/game/ReadyNextStepsCard";
import { ReadyProgressCard } from "@/components/game/ReadyProgressCard";
import { getActiveContext } from "@/domain/whowhatwhere/game";
import type { MatchState } from "@/domain/whowhatwhere/types";
import { LastTurnCard } from "@/features/whowhatwhere/summary/LastTurnCard";
import { Scoreboard } from "@/features/whowhatwhere/summary/Scoreboard";

export function ReadyScreen({
  match,
  error,
  handoffRevealed,
}: {
  readonly match: MatchState;
  readonly error: string;
  readonly handoffRevealed: boolean;
}) {
  const context = getActiveContext(match);
  const describerName = context.describer.name;

  const primaryText = handoffRevealed
    ? "Start the timer from the footer when everyone is ready."
    : `${describerName} taps “${describerName} Ready” in the footer when everyone else is looking away.`;

  const givePhoneLine = handoffRevealed ? (
    <>
      <span className="font-semibold text-foreground">{describerName}</span> has the
      phone.
    </>
  ) : (
    <>
      Give the phone to{" "}
      <span className="font-semibold text-foreground">{describerName}</span>.
    </>
  );

  return (
    <BetweenTurnsLayout
      heading={<GamePanel title={`${context.team.name} up next`} />}
      lastTurnCard={<LastTurnCard summary={match.lastTurnSummary} />}
      nextSteps={
        <ReadyNextStepsCard givePhoneLine={givePhoneLine} primaryText={primaryText} />
      }
      progressCard={
        <ReadyProgressCard label="Round">
          {Math.min(match.roundNumber, match.settings.totalRounds)} /{" "}
          {match.settings.totalRounds}
        </ReadyProgressCard>
      }
      scoreboard={<Scoreboard match={match} />}
      tail={
        error ? (
          <p className="rounded-md border border-semantic-destructive-border-soft bg-semantic-destructive-surface-soft p-3 text-typ-ui text-destructive">
            {error}
          </p>
        ) : null
      }
    />
  );
}
