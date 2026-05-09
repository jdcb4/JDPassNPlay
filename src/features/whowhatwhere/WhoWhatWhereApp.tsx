import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AppInfoHeaderButton,
  AppInfoOverlay,
} from "@/components/AppInfoOverlay";
import { FooterActionLockContext } from "@/components/footerActionLockContext";
import {
  PrimaryFooterButton,
  SecondaryFooterButton,
} from "@/components/game/GameFooterButtons";
import { GameScreenHeaderActions } from "@/components/game/GameScreenHeaderActions";
import { GameResultActions } from "@/components/GameResultActions";
import { GameShell } from "@/components/GameShell";
import { IconCheck, IconChevronRight, IconSkipForward } from "@/components/icons";
import { canQueueSkipped } from "@/domain/whowhatwhere/game";
import { FinalSummaryScreen } from "@/features/whowhatwhere/results/FinalSummaryScreen";
import { ResultsScreen } from "@/features/whowhatwhere/results/ResultsScreen";
import { ResumePrompt } from "@/features/whowhatwhere/ResumePrompt";
import { SettingsScreen } from "@/features/whowhatwhere/setup/SettingsScreen";
import { TeamSetupScreen } from "@/features/whowhatwhere/setup/TeamSetupScreen";
import { ActiveTurnScreen } from "@/features/whowhatwhere/turn/ActiveTurnScreen";
import { ReadyScreen } from "@/features/whowhatwhere/turn/ReadyScreen";
import { useGameController } from "@/features/whowhatwhere/useGameController";

import packageJson from "../../../package.json";

export function WhoWhatWhereApp() {
  const navigate = useNavigate();
  const game = useGameController();
  const [showAppInfo, setShowAppInfo] = useState(false);

  useEffect(() => {
    if (!showAppInfo) {
      return undefined;
    }
    const timeout = setTimeout(() => setShowAppInfo(false), 5000);
    return () => clearTimeout(timeout);
  }, [showAppInfo]);

  const showEndTurn =
    !game.pendingMatch &&
    game.match &&
    game.activeMode === "turn" &&
    Boolean(game.match.activeTurn);

  const headerRight = (
    <GameScreenHeaderActions
      {...(showEndTurn ? { endTurn: { onClick: game.endTurn } } : {})}
      trailing={
        <AppInfoHeaderButton onClick={() => setShowAppInfo(true)} />
      }
    />
  );

  const wrap = (node: ReactNode) => (
    <div className="flex w-full flex-col gap-2">{node}</div>
  );

  let footer: ReactNode | undefined;

  if (game.pendingMatch) {
    footer = wrap(
      <>
        <PrimaryFooterButton
          label="Resume game"
          onClick={game.resumePendingMatch}
        />
        <SecondaryFooterButton
          label="Start new game"
          onClick={game.startOverFromPendingMatch}
        />
      </>,
    );
  } else if (game.activeMode === "settings") {
    footer = wrap(
      <PrimaryFooterButton label="Next: Team 1" onClick={game.goToTeamSetup} />,
    );
  } else if (game.match && game.activeMode === "ready") {
    footer = wrap(
      game.readyHandoffRevealed ? (
        <PrimaryFooterButton
          disabled={game.isStartingTurn}
          label={game.isStartingTurn ? "Loading words" : "Start turn"}
          onClick={() => void game.startNextTurn()}
        />
      ) : (
        <PrimaryFooterButton
          label="Describer ready"
          onClick={() => game.setReadyHandoffRevealed(true)}
        />
      ),
    );
  } else if (
    game.activeMode === "turn" &&
    game.match?.activeTurn
  ) {
    const activeTurn = game.match.activeTurn;
    footer = wrap(
      <>
        <SecondaryFooterButton
          disabled={!canQueueSkipped(activeTurn)}
          icon={<IconSkipForward className="size-5" />}
          label="Skip"
          onClick={game.skip}
        />
        <PrimaryFooterButton
          icon={<IconCheck className="size-5" />}
          label="Correct"
          onClick={game.correct}
        />
      </>,
    );
  } else if (game.match && game.activeMode === "finalSummary") {
    footer = wrap(
      <PrimaryFooterButton
        icon={<IconChevronRight className="size-5" />}
        label="View final scores"
        onClick={game.viewResults}
      />,
    );
  } else if (game.match && game.activeMode === "results") {
    footer = wrap(
      <GameResultActions
        onNewGame={game.backToSetup}
        onPickAnotherGame={() => navigate("/")}
        onReplay={game.playAgain}
      />,
    );
  }

  return (
    <FooterActionLockContext.Provider value={game.footerActionsLocked}>
      <GameShell footer={footer} headerRight={headerRight} title="Who What Where">
        <AppInfoOverlay
          open={showAppInfo}
          version={packageJson.version}
          onClose={() => setShowAppInfo(false)}
        />

        {game.pendingMatch ? (
          <ResumePrompt savedMatch={game.pendingMatch} />
        ) : null}

        {!game.pendingMatch && game.activeMode === "settings" ? (
          <SettingsScreen
            settings={game.settings}
            onChange={game.updateSettings}
          />
        ) : null}

        {!game.pendingMatch && game.activeMode === "team" ? (
          <TeamSetupScreen
            error={game.setupError}
            settings={game.settings}
            teamIndex={game.teamStep}
            teams={game.teamSetups}
            onBack={game.goBackFromTeamSetup}
            onNext={game.advanceTeamSetup}
            onTeamsChange={game.setTeamSetups}
          />
        ) : null}

        {!game.pendingMatch && game.match && game.activeMode === "ready" ? (
          <ReadyScreen
            key={`${game.match.roundNumber}-${game.match.teamIndex}`}
            error={game.turnError}
            handoffRevealed={game.readyHandoffRevealed}
            match={game.match}
            onBackToSetup={game.backToSetup}
          />
        ) : null}

        {!game.pendingMatch &&
        game.match &&
        game.activeMode === "turn" &&
        game.match.activeTurn ? (
          <ActiveTurnScreen
            match={game.match}
            onReturnSkipped={game.returnSkipped}
          />
        ) : null}

        {!game.pendingMatch && game.match && game.activeMode === "finalSummary" ? (
          <FinalSummaryScreen match={game.match} />
        ) : null}

        {!game.pendingMatch && game.match && game.activeMode === "results" ? (
          <ResultsScreen match={game.match} />
        ) : null}
      </GameShell>
    </FooterActionLockContext.Provider>
  );
}
