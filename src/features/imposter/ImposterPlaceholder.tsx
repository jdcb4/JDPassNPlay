import { Link } from "react-router-dom";

import { GamePanel } from "@/components/game/GamePanel";
import { GameShell } from "@/components/GameShell";

/** Placeholder route — full Imposter rules and flow are still to be defined. */
export function ImposterPlaceholder() {
  return (
    <GameShell title="Imposter">
      <GamePanel
        eyebrow="Work in progress"
        subtitle="This slot reserves the third game in the launcher. When you are ready to define roles, discussion timing, and voting, we can implement the full flow here without changing the hub layout."
        title="Imposter is on the roadmap"
      >
        <Link
          className="mt-2 inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-4 font-medium text-typ-ui shadow-sm hover:bg-accent"
          to="/"
        >
          Back to game picker
        </Link>
      </GamePanel>
    </GameShell>
  );
}
