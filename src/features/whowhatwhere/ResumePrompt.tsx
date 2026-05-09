import type { PersistedMatch } from "@/services/whowhatwherePersistence";

/**
 * Explains the resume choice; primary actions live in the shared `GameShell` footer.
 */
export function ResumePrompt({
  savedMatch,
}: {
  readonly savedMatch: PersistedMatch;
}) {
  return (
    <section className="flex flex-1 flex-col justify-center gap-6 pb-4">
      <div className="space-y-3">
        <p className="text-sm font-medium text-primary">Game in progress</p>
        <h2 className="text-2xl font-semibold tracking-normal">
          Resume your saved game?
        </h2>
        <p className="text-base leading-7 text-muted-foreground">
          We found a game saved at {formatSavedAt(savedMatch.savedAt)}. Use the
          buttons below.
        </p>
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
