import { Link } from "react-router-dom";

import { GameShell } from "@/components/GameShell";

/** Placeholder route — full Imposter rules and flow are still to be defined. */
export function ImposterPlaceholder() {
  return (
    <GameShell title="Imposter">
      <div className="flex flex-1 flex-col gap-4">
        <p className="text-sm font-medium text-primary">Work in progress</p>
        <h2 className="text-2xl font-semibold tracking-tight">
          Imposter is on the roadmap
        </h2>
        <p className="text-muted-foreground">
          This slot reserves the third game in the launcher. When you are ready
          to define roles, discussion timing, and voting, we can implement the
          full flow here without changing the hub layout.
        </p>
        <Link
          className="mt-4 inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm hover:bg-accent"
          to="/"
        >
          Back to game picker
        </Link>
      </div>
    </GameShell>
  );
}
