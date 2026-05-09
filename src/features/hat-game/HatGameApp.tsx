import { useNavigate } from "react-router-dom";

import {
  AppInfoHeaderButton,
  AppInfoOverlay,
} from "@/components/AppInfoOverlay";
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
  const showAppInfo = controller.loaded;
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
      {showAppInfo ? (
        <AppInfoHeaderButton
          onClick={() => controller.setShowInfoPopup(true)}
        />
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
      {controller.error && controller.snapshot.step !== "team" ? (
        <p className="mb-3 text-sm font-medium text-destructive">
          {controller.error}
        </p>
      ) : null}
      {screen.content}

      <AppInfoOverlay
        open={controller.showInfoPopup}
        version={controller.appVersion}
        onClose={() => controller.setShowInfoPopup(false)}
      />
    </GameShell>
  );
}
