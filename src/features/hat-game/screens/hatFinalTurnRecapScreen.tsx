import { FINAL_TURN_RECAP_NEXT_STEPS } from "@/components/game/finalTurnRecapCopy";
import { PrimaryFooterButton } from "@/components/game/GameFooterButtons";
import { HatLastTurnCard } from "@/components/game/HatLastTurnCard";
import { ReadyNextStepsCard } from "@/components/game/ReadyNextStepsCard";
import { ThatsTheLastTurnCard } from "@/components/game/ThatsTheLastTurnCard";
import type { HatGameSession } from "@/domain/hat-game/types";
import type { ScreenModel } from "@/features/hat-game/hatGameAppTypes";
import type { HatGameAppController } from "@/features/hat-game/useHatGameApp";

export function hatFinalTurnRecapScreen(
  controller: HatGameAppController,
  session: HatGameSession,
): ScreenModel {
  const previousTurn = session.lastTurnSummary;

  return {
    content: (
      <section className="flex flex-1 flex-col gap-4 pb-4">
        <ThatsTheLastTurnCard />
        {previousTurn ? <HatLastTurnCard summary={previousTurn} /> : null}
        <ReadyNextStepsCard primaryText={FINAL_TURN_RECAP_NEXT_STEPS} />
      </section>
    ),
    actions: (
      <PrimaryFooterButton
        label="Final scores"
        onClick={() => controller.dispatchGameAction({ type: "view-results" })}
      />
    ),
  };
}
