import { useNavigate } from "react-router-dom";

import { GameShell } from "@/components/GameShell";
import { Button } from "@/components/ui/button";
import { HatActionLockContext } from "@/features/hat-game/hatActionLockContext";
import { buildHatGameScreen } from "@/features/hat-game/HatGameWebScreens";
import { useHatGameApp } from "@/features/hat-game/useHatGameApp";

export function HatGameApp() {
  const navigate = useNavigate();
  const controller = useHatGameApp();
  const screen = buildHatGameScreen(controller, navigate);

  const showExit = controller.loaded && controller.snapshot.step !== "landing";
  const showInfo = controller.loaded && controller.snapshot.step === "landing";
  const showEndTurn =
    controller.loaded &&
    controller.snapshot.step === "game" &&
    controller.snapshot.session?.stage === "turn";

  const headerRight = (
    <>
      {showEndTurn ? (
        <Button
          className="h-9 px-2 text-xs"
          onClick={() =>
            controller.dispatchGameAction({ type: "end-turn" })
          }
          type="button"
        >
          End turn
        </Button>
      ) : null}
      {showExit ? (
        <Button
          className="h-9 px-2 text-xs"
          onClick={controller.exitToLanding}
          type="button"
          variant="outline"
        >
          Exit
        </Button>
      ) : null}
      {showInfo ? (
        <Button
          aria-label="App information"
          className="h-9 w-9 shrink-0 rounded-full p-0 text-sm font-semibold"
          onClick={() => controller.setShowInfoPopup(true)}
          type="button"
          variant="secondary"
        >
          i
        </Button>
      ) : null}
    </>
  );

  const footer = screen.actions ? (
    <HatActionLockContext.Provider value={controller.footerActionsLocked}>
      <div className="flex w-full flex-col gap-2">
        {screen.actions}
      </div>
    </HatActionLockContext.Provider>
  ) : undefined;

  return (
    <GameShell footer={footer} headerRight={headerRight} title="Hat Game">
      {controller.error ? (
        <p className="mb-3 text-sm font-medium text-destructive">
          {controller.error}
        </p>
      ) : null}
      {screen.content}

      {controller.showInfoPopup ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 sm:items-center"
          role="dialog"
        >
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-4 shadow-xl">
            <div className="flex items-start justify-between gap-2">
              <p className="text-lg font-semibold">Hat Game</p>
              <Button
                aria-label="Close"
                className="h-8 px-2"
                onClick={() => controller.setShowInfoPopup(false)}
                type="button"
                variant="ghost"
              >
                ×
              </Button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              By jdcb4. Version {controller.appVersion}.
            </p>
          </div>
        </div>
      ) : null}
    </GameShell>
  );
}
