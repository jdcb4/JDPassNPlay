import { useEffect, useMemo, useState } from "react";

import { FOOTER_ACTION_LOCK_MS } from "@/components/footerActionLockContext";
import {
  correctWord,
  createMatch,
  endTurn,
  isTurnExpired,
  returnSkippedWord,
  showResults,
  skipWord,
  startTurn,
} from "@/domain/whowhatwhere/game";
import { reconcileTeamSetups, validateSetup } from "@/domain/whowhatwhere/setup";
import type { GameSettings, MatchState, TeamSetup } from "@/domain/whowhatwhere/types";
import {
  clearMatch,
  loadMatch,
  loadSetup,
  type PersistedMatch,
  saveMatch,
  saveSetup,
} from "@/services/whowhatwherePersistence";
import { playSound } from "@/services/whowhatwhereSound";

type AppMode =
  | "settings"
  | "team"
  | "ready"
  | "turn"
  | "finalSummary"
  | "results";

export function useGameController() {
  const initialSetup = useMemo(() => loadSetup(), []);
  const [settings, setSettings] = useState(initialSetup.settings);
  const [teamSetups, setTeamSetups] = useState(initialSetup.teams);
  const [teamStep, setTeamStep] = useState(0);
  const [match, setMatch] = useState<MatchState | null>(null);
  const [mode, setMode] = useState<AppMode>("settings");
  const [pendingMatch, setPendingMatch] = useState<PersistedMatch | null>(() =>
    loadMatch(),
  );
  const [setupError, setSetupError] = useState("");
  const [turnError, setTurnError] = useState("");
  const [isStartingTurn, setIsStartingTurn] = useState(false);
  const [footerActionsLocked, setFooterActionsLocked] = useState(false);
  const [readyHandoffRevealed, setReadyHandoffRevealed] = useState(false);

  useEffect(() => {
    saveSetup({ settings, teams: teamSetups });
  }, [settings, teamSetups]);

  useEffect(() => {
    if (!match) {
      return;
    }
    // Finished matches are not resumed — only in-progress games (tab close / refresh).
    if (match.stage === "results") {
      clearMatch();
      return;
    }
    saveMatch(match);
  }, [match]);

  useEffect(() => {
    if (match?.stage !== "turn" || !match.activeTurn) {
      return;
    }

    const interval = window.setInterval(() => {
      setMatch((currentMatch) => {
        if (
          !currentMatch?.activeTurn ||
          currentMatch.stage !== "turn" ||
          !isTurnExpired(currentMatch.activeTurn)
        ) {
          return currentMatch;
        }

        playSound("turnEnd");
        return endTurn(currentMatch);
      });
    }, 250);

    return () => window.clearInterval(interval);
  }, [match?.activeTurn, match?.stage]);

  const activeMode: AppMode = match
    ? match.stage === "ready"
      ? "ready"
      : match.stage
    : mode;

  useEffect(() => {
    setReadyHandoffRevealed(false);
  }, [match?.roundNumber, match?.teamIndex, match?.stage]);

  const actionLockKey = [
    pendingMatch ? "pending" : "idle",
    activeMode,
    teamStep,
    match?.roundNumber ?? "-",
    match?.teamIndex ?? "-",
    readyHandoffRevealed ? "go" : "pass",
    match?.activeTurn?.startedAt ?? "no-turn",
  ].join(":");

  useEffect(() => {
    setFooterActionsLocked(true);
    const timeout = window.setTimeout(
      () => setFooterActionsLocked(false),
      FOOTER_ACTION_LOCK_MS,
    );
    return () => window.clearTimeout(timeout);
  }, [actionLockKey]);

  const updateSettings = (nextSettings: GameSettings) => {
    setSettings(nextSettings);
    setTeamSetups((currentTeams) =>
      reconcileTeamSetups(currentTeams, nextSettings.teamCount),
    );
  };

  const goToTeamSetup = () => {
    setSetupError("");
    setTeamSetups((currentTeams) =>
      reconcileTeamSetups(currentTeams, settings.teamCount),
    );
    setTeamStep(0);
    setMode("team");
  };

  const goBackFromTeamSetup = () => {
    setSetupError("");
    if (teamStep === 0) {
      setMode("settings");
    } else {
      setTeamStep((currentStep) => currentStep - 1);
    }
  };

  const advanceTeamSetup = () => {
    setSetupError("");
    if (teamStep < settings.teamCount - 1) {
      setTeamStep((currentStep) => currentStep + 1);
      return;
    }

    startNewMatch();
  };

  const startNewMatch = () => {
    const errors = validateSetup(teamSetups, settings);

    if (errors.length > 0) {
      setSetupError(errors[0] ?? "Check the setup.");
      return;
    }

    try {
      clearMatch();
      setMatch(createMatch(teamSetups, settings));
      setSetupError("");
    } catch (error) {
      setSetupError(error instanceof Error ? error.message : "Unable to start.");
    }
  };

  const startNextTurn = async () => {
    setTurnError("");
    setIsStartingTurn(true);

    try {
      const { wordDeck } = await import("@/data/words.generated");

      setMatch((currentMatch) =>
        currentMatch ? startTurn(currentMatch, wordDeck) : currentMatch,
      );
    } catch (error) {
      setTurnError(
        error instanceof Error ? error.message : "Unable to start this turn.",
      );
    } finally {
      setIsStartingTurn(false);
    }
  };

  const resumePendingMatch = () => {
    if (!pendingMatch) {
      return;
    }

    const restoredMatch =
      pendingMatch.match.stage === "turn" &&
      pendingMatch.match.activeTurn &&
      isTurnExpired(pendingMatch.match.activeTurn)
        ? endTurn(pendingMatch.match)
        : pendingMatch.match;

    setMatch(restoredMatch);
    setPendingMatch(null);
  };

  const startOverFromPendingMatch = () => {
    clearMatch();
    setMatch(null);
    setPendingMatch(null);
    setMode("settings");
  };

  const backToSetup = () => {
    clearMatch();
    setMatch(null);
    setMode("settings");
  };

  const playAgain = () => {
    setMatch(createMatch(teamSetups, settings));
  };

  return {
    activeMode,
    settings,
    teamSetups,
    teamStep,
    match,
    pendingMatch,
    setupError,
    turnError,
    isStartingTurn,
    footerActionsLocked,
    readyHandoffRevealed,
    setReadyHandoffRevealed,
    setTeamSetups: setTeamSetups as (teams: TeamSetup[]) => void,
    updateSettings,
    goToTeamSetup,
    goBackFromTeamSetup,
    advanceTeamSetup,
    resumePendingMatch,
    startOverFromPendingMatch,
    startNextTurn,
    backToSetup,
    playAgain,
    correct: () => {
      playSound("correct");
      setMatch((currentMatch) =>
        currentMatch ? correctWord(currentMatch) : currentMatch,
      );
    },
    skip: () => {
      playSound("skip");
      setMatch((currentMatch) =>
        currentMatch ? skipWord(currentMatch) : currentMatch,
      );
    },
    returnSkipped: (skippedWordId: string) => {
      playSound("returnSkipped");
      setMatch((currentMatch) =>
        currentMatch
          ? returnSkippedWord(currentMatch, skippedWordId)
          : currentMatch,
      );
    },
    endTurn: () => {
      playSound("turnEnd");
      setMatch((currentMatch) =>
        currentMatch ? endTurn(currentMatch) : currentMatch,
      );
    },
    viewResults: () => {
      playSound("gameOver");
      setMatch((currentMatch) =>
        currentMatch ? showResults(currentMatch) : currentMatch,
      );
    },
  };
}
