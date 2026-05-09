import { GamePanel } from "@/components/game/GamePanel";
import type { MatchState } from "@/domain/whowhatwhere/types";

export function ResultsScreen({
  match,
}: {
  readonly match: MatchState;
}) {
  const results = match.results;

  return (
    <section className="flex flex-1 flex-col pb-4">
      <GamePanel
        eyebrow="Final results"
        title={results?.isTie ? "It is a tie" : "Winner crowned"}
      >
        <div className="grid gap-3">
          {results?.bestTurn && (
            <div className="rounded-md border bg-card p-4">
              <p className="text-sm font-medium text-muted-foreground">
                Best turn
              </p>
              <p className="mt-1 font-semibold">
                {results.bestTurn.teamName}: +{results.bestTurn.scoreDelta}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {results.bestTurn.describerName}
              </p>
            </div>
          )}
          {results?.leaderboard?.map((entry, index) => (
            <div
              key={entry.teamId}
              className="flex items-center justify-between rounded-md border bg-card p-4"
            >
              <div className="flex items-center gap-3">
                <p className="w-8 text-sm font-semibold text-muted-foreground">
                  #{index + 1}
                </p>
                <p className="font-semibold">{entry.teamName}</p>
              </div>
              <p className="text-2xl font-bold">{entry.score}</p>
            </div>
          ))}
        </div>
      </GamePanel>
    </section>
  );
}
