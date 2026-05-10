import {
  PrimaryFooterButton,
  SecondaryFooterButton,
} from "@/components/game/GameFooterButtons";
import { GamePanel } from "@/components/game/GamePanel";
import { ResumeGameCard } from "@/components/game/ResumeGameCard";
import type { ScreenModel } from "@/features/hat-game/hatGameAppTypes";
import type { HatGameAppController } from "@/features/hat-game/useHatGameApp";
import { formatSavedAt } from "@/lib/formatSavedAt";

export function hatLandingScreen(controller: HatGameAppController): ScreenModel {
  return {
    content: (
      <GamePanel
        subtitle="A pass-and-play Celebrity-style party game. Add famous figures, split into teams, then race through Describe, One Word, and Charades with the same figure pool."
        title="Hat Game"
      >
        {controller.savedRecord && !controller.confirmNewGame ? (
          <ResumeGameCard
            savedAtLabel={formatSavedAt(controller.savedRecord.lastSavedAt)}
            onResume={controller.resumeSavedGame}
          />
        ) : null}

        {controller.confirmNewGame ? (
          <p className="text-typ-ui font-medium text-destructive">
            Start a new game? This will discard the saved game on this device.
          </p>
        ) : null}
      </GamePanel>
    ),
    actions: controller.confirmNewGame ? (
      <>
        <SecondaryFooterButton
          label="Cancel"
          onClick={() => controller.setConfirmNewGame(false)}
        />
        <PrimaryFooterButton
          label="Discard saved game"
          onClick={() => void controller.startNewGame()}
        />
      </>
    ) : controller.savedRecord ? (
      <PrimaryFooterButton
        label="Start new game"
        onClick={() => controller.setConfirmNewGame(true)}
      />
    ) : (
      <PrimaryFooterButton
        label="Start game"
        onClick={() => void controller.startNewGame()}
      />
    ),
  };
}
