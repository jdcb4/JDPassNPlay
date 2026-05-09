import type { LastTurnSummary, WordHistoryEntry } from "@/domain/whowhatwhere/types";

export function LastTurnCard({
  summary,
}: {
  readonly summary: LastTurnSummary | null;
}) {
  if (!summary) {
    return null;
  }

  return (
    <div className="rounded-md border bg-card p-4">
      <p className="text-sm font-medium text-muted-foreground">Last turn</p>
      <p className="mt-1 font-semibold">
        {summary.teamName}: +{summary.scoreDelta}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {summary.describerName} got {summary.correctCount} correct and skipped{" "}
        {summary.skippedCount}.
      </p>
      <TurnWords summary={summary} />
    </div>
  );
}

function TurnWords({ summary }: { readonly summary: LastTurnSummary }) {
  const correct = summary.wordHistory.filter((entry) => entry.status === "correct");
  const skipped = summary.wordHistory.filter((entry) => entry.status === "skipped");

  if (correct.length === 0 && skipped.length === 0 && !summary.finalWord) {
    return null;
  }

  return (
    <details className="mt-3">
      <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
        Words
      </summary>
      <div className="mt-2 max-h-28 space-y-2 overflow-y-auto text-xs">
        <WordChipGroup label="Correct" entries={correct} />
        <WordChipGroup label="Skipped" entries={skipped} />
        {summary.finalWord && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 font-semibold text-muted-foreground">Final</span>
            <span className="rounded-full border px-2 py-1">
              {summary.finalWord.word}
            </span>
          </div>
        )}
      </div>
    </details>
  );
}

function WordChipGroup({
  label,
  entries,
}: {
  readonly label: string;
  readonly entries: readonly WordHistoryEntry[];
}) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 font-semibold text-muted-foreground">{label}</span>
      {entries.map((entry) => (
        <span
          key={`${entry.timestamp}-${entry.word.word}-${entry.status}`}
          className="rounded-full border px-2 py-1"
        >
          {entry.word.word}
        </span>
      ))}
    </div>
  );
}
