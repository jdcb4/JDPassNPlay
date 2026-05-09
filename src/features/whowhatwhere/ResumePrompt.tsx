import { GamePanel } from "@/components/game/GamePanel";
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
    <section className="flex flex-1 flex-col justify-center pb-4">
      <GamePanel
        eyebrow="Game in progress"
        subtitle={`We found a game saved at ${formatSavedAt(savedMatch.savedAt)}. Use the buttons below.`}
        title="Resume your saved game?"
      />
    </section>
  );
}

function formatSavedAt(savedAt: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(savedAt));
}
