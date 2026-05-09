import { useEffect, useRef, useState } from "react";

import { IconCheck, IconSkipForward, IconX } from "@/components/icons";
import { Metric } from "@/components/Metric";
import { Button } from "@/components/ui/button";
import {
  canQueueSkipped,
  getActiveContext,
  getCurrentWord,
  getSecondsLeft,
} from "@/domain/whowhatwhere/game";
import type { MatchState } from "@/domain/whowhatwhere/types";
import { playSound } from "@/services/whowhatwhereSound";

export function ActiveTurnScreen({
  match,
  onCorrect,
  onSkip,
  onReturnSkipped,
  onEndTurn,
}: {
  readonly match: MatchState;
  readonly onCorrect: () => void;
  readonly onSkip: () => void;
  readonly onReturnSkipped: (skippedWordId: string) => void;
  readonly onEndTurn: () => void;
}) {
  const [, setTick] = useState(0);
  const activeTurn = match.activeTurn!;
  const context = getActiveContext(match);
  const currentWord = getCurrentWord(activeTurn);
  const secondsLeft = getSecondsLeft(activeTurn);
  const warningPlayedForTurn = useRef<string | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTick((tick) => tick + 1);

      const currentSecondsLeft = getSecondsLeft(activeTurn);

      if (
        currentSecondsLeft <= 10 &&
        currentSecondsLeft > 0 &&
        warningPlayedForTurn.current !== activeTurn.startedAt
      ) {
        warningPlayedForTurn.current = activeTurn.startedAt;
        playSound("warning");
      }
    }, 250);

    return () => window.clearInterval(interval);
  }, [activeTurn]);

  return (
    <section className="flex flex-1 flex-col gap-5 pb-[calc(env(safe-area-inset-bottom)+6rem)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{context.team.name} up</p>
          <h2 className="text-xl font-semibold">{context.describer.name}</h2>
        </div>
        <Button aria-label="End turn" size="icon" variant="outline" onClick={onEndTurn}>
          <IconX className="size-5" aria-hidden="true" />
        </Button>
      </div>

      <div className="rounded-md border bg-card p-5 text-center shadow-sm">
        <p className="text-sm font-medium text-muted-foreground">Current word</p>
        <p className="mt-4 min-h-24 break-words text-4xl font-bold tracking-normal">
          {currentWord?.word ?? "No word"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Metric label="Time left" value={formatSeconds(secondsLeft)} />
        <Metric label="Category" value={activeTurn.category} />
        <Metric label="Score" value={String(activeTurn.score)} />
        <Metric label="Skipped waiting" value={String(activeTurn.skippedWords.length)} />
      </div>

      {(activeTurn.currentWordSource === "skipped" ||
        activeTurn.skippedWords.length > 0) && (
        <div className="rounded-md border bg-card p-4">
          <h3 className="font-semibold">
            {activeTurn.currentWordSource === "skipped"
              ? "Working through skipped words"
              : "Skipped words waiting"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick a waiting word to return to it now.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {activeTurn.skippedWords.map((skippedWord) => (
              <Button
                key={skippedWord.id}
                size="sm"
                variant="outline"
                onClick={() => onReturnSkipped(skippedWord.id)}
              >
                {skippedWord.word.word}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="fixed inset-x-0 bottom-0 border-t bg-background/95 px-5 py-3 backdrop-blur">
        <div className="mx-auto grid max-w-md grid-cols-2 gap-3 pb-[env(safe-area-inset-bottom)]">
          <Button
            className="h-14"
            variant="secondary"
            disabled={!canQueueSkipped(activeTurn)}
            onClick={onSkip}
          >
            <IconSkipForward className="size-5" aria-hidden="true" />
            Skip
          </Button>
          <Button className="h-14" onClick={onCorrect}>
            <IconCheck className="size-5" aria-hidden="true" />
            Correct
          </Button>
        </div>
      </div>
    </section>
  );
}

function formatSeconds(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;

  return minutes > 0
    ? `${minutes}:${String(remainder).padStart(2, "0")}`
    : `${remainder}`;
}
