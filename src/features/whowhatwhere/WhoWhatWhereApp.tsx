import { useNavigate } from "react-router-dom";

import { GameShell } from "@/components/GameShell";
import { IconSparkles } from "@/components/icons";
import { FinalSummaryScreen } from "@/features/whowhatwhere/results/FinalSummaryScreen";
import { ResultsScreen } from "@/features/whowhatwhere/results/ResultsScreen";
import { ResumePrompt } from "@/features/whowhatwhere/ResumePrompt";
import { SettingsScreen } from "@/features/whowhatwhere/setup/SettingsScreen";
import { TeamSetupScreen } from "@/features/whowhatwhere/setup/TeamSetupScreen";
import { ActiveTurnScreen } from "@/features/whowhatwhere/turn/ActiveTurnScreen";
import { ReadyScreen } from "@/features/whowhatwhere/turn/ReadyScreen";
import { useGameController } from "@/features/whowhatwhere/useGameController";

export function WhoWhatWhereApp() {
  const navigate = useNavigate();
  const game = useGameController();

  return (
    <GameShell
      headerRight={
        <div
          aria-hidden="true"
          className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground"
        >
          <IconSparkles className="size-5" />
        </div>
      }
      title="Who What Where"
    >
      {game.pendingMatch ? (
        <ResumePrompt
          savedMatch={game.pendingMatch}
          onResume={game.resumePendingMatch}
          onStartNew={game.startOverFromPendingMatch}
        />
      ) : null}

      {!game.pendingMatch && game.activeMode === "settings" ? (
        <SettingsScreen
          settings={game.settings}
          onChange={game.updateSettings}
          onNext={game.goToTeamSetup}
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
          isLoading={game.isStartingTurn}
          match={game.match}
          onBackToSetup={game.backToSetup}
          onStartTurn={game.startNextTurn}
        />
      ) : null}

      {!game.pendingMatch &&
      game.match &&
      game.activeMode === "turn" &&
      game.match.activeTurn ? (
        <ActiveTurnScreen
          match={game.match}
          onCorrect={game.correct}
          onEndTurn={game.endTurn}
          onReturnSkipped={game.returnSkipped}
          onSkip={game.skip}
        />
      ) : null}

      {!game.pendingMatch && game.match && game.activeMode === "finalSummary" ? (
        <FinalSummaryScreen match={game.match} onViewResults={game.viewResults} />
      ) : null}

      {!game.pendingMatch && game.match && game.activeMode === "results" ? (
        <ResultsScreen
          match={game.match}
          onNewGame={game.backToSetup}
          onPickAnotherGame={() => navigate("/")}
          onReplay={game.playAgain}
        />
      ) : null}
    </GameShell>
  );
}
