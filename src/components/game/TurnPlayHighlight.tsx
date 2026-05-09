import type { ReactNode } from "react";

/** Large shaded cue area — matches Hat Game “current clue” styling. */
export function TurnPlayHighlight({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border-2 border-primary/40 bg-primary/5 p-6 text-center text-typ-highlight font-semibold">
      {children}
    </div>
  );
}
