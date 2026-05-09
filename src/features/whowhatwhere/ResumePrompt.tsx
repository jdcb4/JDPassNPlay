import { Button } from "@/components/ui/button";
import type { PersistedMatch } from "@/services/whowhatwherePersistence";

export function ResumePrompt({
  savedMatch,
  onResume,
  onStartNew,
}: {
  readonly savedMatch: PersistedMatch;
  readonly onResume: () => void;
  readonly onStartNew: () => void;
}) {
  return (
    <section className="flex flex-1 flex-col justify-center gap-6 pb-8">
      <div className="space-y-3">
        <p className="text-sm font-medium text-primary">Game in progress</p>
        <h2 className="text-2xl font-semibold tracking-normal">
          Resume your saved game?
        </h2>
        <p className="text-base leading-7 text-muted-foreground">
          We found a game saved at {formatSavedAt(savedMatch.savedAt)}.
        </p>
      </div>
      <div className="grid gap-3">
        <Button className="h-12" onClick={onResume}>
          Resume game
        </Button>
        <Button className="h-12" variant="outline" onClick={onStartNew}>
          Start new game
        </Button>
      </div>
    </section>
  );
}

function formatSavedAt(savedAt: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(savedAt));
}
