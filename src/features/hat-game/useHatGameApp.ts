import { useEffect, useMemo, useRef, useState } from "react";

import { GAME_DEFAULTS } from "@/config/hatGameDefaults";
import clueSuggestions from "@/data/clueSuggestions.json";
import {
  applyHatGameAction,
  createHatGameSession,
} from "@/domain/hat-game/engine";
import { buildDefaultSetup, getHatGameSetupError } from "@/domain/hat-game/setup";
import { getCountdownSeconds } from "@/domain/hat-game/time";
import type { ClueSubmissionMap, HatGameAction } from "@/domain/hat-game/types";
import type { AppSnapshot, AppStep, StoragePayload } from "@/features/hat-game/hatGameAppTypes";
import { playSoundCue } from "@/services/hatGameSound";
import {
  clearSavedState,
  loadSavedState,
  saveState,
} from "@/services/hatGameStorage";

import packageJson from "../../../package.json";

const ACTION_LOCK_MS = 500;

const createEmptyClues = () => Array.from({ length: GAME_DEFAULTS.cluesPerPlayer }, () => '');

const createInitialSnapshot = (step: AppStep = 'counts'): AppSnapshot => {
  const { teams, players } = buildDefaultSetup(4, 2);
  return {
    step,
    teamEditIndex: 0,
    playerCount: 4,
    teamCount: 2,
    teams,
    players,
    clueSubmissions: Object.fromEntries(players.map((player) => [player.id, { clues: createEmptyClues() }])),
    clueEntryIndex: 0,
    clueEntryRevealed: false,
    handoffRevealed: false,
    session: null
  };
};

const syncClueSubmissions = (players: AppSnapshot['players'], current: ClueSubmissionMap): ClueSubmissionMap =>
  Object.fromEntries(
    players.map((player) => [
      player.id,
      {
        clues: Array.from(
          { length: GAME_DEFAULTS.cluesPerPlayer },
          (_, index) => current[player.id]?.clues[index] ?? ''
        )
      }
    ])
  );

const isError = (value: unknown): value is { error: string } =>
  Boolean(value && typeof value === 'object' && 'error' in value);

const isStoragePayload = (value: unknown): value is StoragePayload =>
  Boolean(
    value &&
      typeof value === 'object' &&
      'schemaVersion' in value &&
      'snapshot' in value &&
      'lastSavedAt' in value
  );

const chooseSuggestion = (used: string[]) => {
  const remaining = (clueSuggestions as string[]).filter((suggestion) => !used.includes(suggestion));
  const source = remaining.length > 0 ? remaining : (clueSuggestions as string[]);
  return source[Math.floor(Math.random() * source.length)] ?? '';
};

export const formatSavedAt = (value?: string) => {
  if (!value) {
    return '';
  }
  return new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

export function useHatGameApp() {
  const [snapshot, setSnapshot] = useState<AppSnapshot>(() => createInitialSnapshot('landing'));
  const [savedRecord, setSavedRecord] = useState<StoragePayload | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [confirmNewGame, setConfirmNewGame] = useState(false);
  const [footerActionsLocked, setFooterActionsLocked] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const warningCueTurnRef = useRef<string | null>(null);
  const turnEndCueTurnRef = useRef<string | null>(null);
  const snapshotRef = useRef(snapshot);

  useEffect(() => {
    snapshotRef.current = snapshot;
  }, [snapshot]);

  useEffect(() => {
    void loadSavedState<StoragePayload | AppSnapshot>().then((saved) => {
      if (!saved) {
        return;
      }
      const record = isStoragePayload(saved)
        ? saved
        : {
            schemaVersion: 1 as const,
            lastSavedAt: new Date().toISOString(),
            snapshot: saved,
          };
      // Do not offer resume after a finished game (stale storage from older builds).
      if (
        record.snapshot.step === "game" &&
        record.snapshot.session?.stage === "results"
      ) {
        void clearSavedState();
        return;
      }
      setSavedRecord(record);
    })
    .finally(() => {
      setLoaded(true);
    });
  }, []);

  const persistSnapshot = async (nextSnapshot: AppSnapshot) => {
    if (nextSnapshot.step === "landing") {
      return null;
    }
    // Finished session: keep UI in memory but drop persistence so "Resume" is for mid-game only.
    if (
      nextSnapshot.step === "game" &&
      nextSnapshot.session?.stage === "results"
    ) {
      setSavedRecord(null);
      await clearSavedState();
      return null;
    }
    const record: StoragePayload = {
      schemaVersion: 1,
      lastSavedAt: new Date().toISOString(),
      snapshot: nextSnapshot,
    };
    setSavedRecord(record);
    await saveState(record);
    return record;
  };

  useEffect(() => {
    if (loaded && snapshot.step !== 'landing') {
      persistSnapshot(snapshot).catch(() => undefined);
    }
  }, [loaded, snapshot]);

  const dispatchGameAction = (action: HatGameAction) => {
    const previousSession = snapshotRef.current.session;
    if (!previousSession) {
      return;
    }
    const result = applyHatGameAction(previousSession, action);
    if (isError(result)) {
      setError(result.error);
      return;
    }

    if (action.type === 'start-turn' && previousSession.stage === 'ready' && result.stage === 'turn') {
      playSoundCue('turn-start');
    }
    if (action.type === 'mark-correct') {
      playSoundCue('correct');
    }
    if (action.type === 'skip-clue') {
      playSoundCue('skip');
    }
    if (previousSession.stage === 'turn' && result.stage !== 'turn') {
      const turnCueKey = previousSession.activeTurn?.startedAt ?? previousSession.activeTurn?.endsAt ?? '';
      if (turnEndCueTurnRef.current !== turnCueKey) {
        turnEndCueTurnRef.current = turnCueKey;
        playSoundCue('turn-end');
      }
    }
    if (result.phaseNumber !== previousSession.phaseNumber) {
      if (result.phaseNumber === 2) {
        playSoundCue('phase-one-word');
      }
      if (result.phaseNumber === 3) {
        playSoundCue('phase-charades');
      }
    }

    setError('');
    setSnapshot((current) => ({
      ...current,
      session: result,
      handoffRevealed: result.stage === 'ready' ? false : current.handoffRevealed
    }));
  };

  useEffect(() => {
    if (snapshot.step !== 'game' || snapshot.session?.stage !== 'turn' || !snapshot.session.activeTurn?.endsAt) {
      setSecondsRemaining(0);
      warningCueTurnRef.current = null;
      return undefined;
    }

    const turnCueKey = snapshot.session.activeTurn.startedAt;
    const tick = () => {
      const remaining = getCountdownSeconds(snapshotRef.current.session?.activeTurn?.endsAt);
      setSecondsRemaining(remaining);
      if (remaining <= 10 && remaining > 0 && warningCueTurnRef.current !== turnCueKey) {
        warningCueTurnRef.current = turnCueKey;
        playSoundCue('ten-second-warning');
      }
      if (remaining <= 0) {
        dispatchGameAction({ type: 'end-turn' });
      }
    };

    tick();
    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [
    snapshot.step,
    snapshot.session?.activeTurn?.endsAt,
    snapshot.session?.activeTurn?.startedAt,
    snapshot.session?.stage,
  ]);

  const activeTeam = useMemo(() => {
    if (snapshot.step === 'team') {
      return snapshot.teams[snapshot.teamEditIndex] ?? null;
    }
    return null;
  }, [snapshot.step, snapshot.teamEditIndex, snapshot.teams]);

  const activeTeamPlayers = useMemo(
    () => (activeTeam ? snapshot.players.filter((player) => player.teamId === activeTeam.id) : []),
    [activeTeam, snapshot.players]
  );

  const actionLockKey = [
    loaded ? 'loaded' : 'loading',
    snapshot.step,
    snapshot.teamEditIndex,
    snapshot.clueEntryIndex,
    snapshot.clueEntryRevealed ? 'clue-open' : 'clue-closed',
    snapshot.handoffRevealed ? 'handoff-open' : 'handoff-closed',
    snapshot.session?.stage ?? 'no-session',
    snapshot.session?.phaseNumber ?? 'no-phase',
    snapshot.session?.activeTurn?.startedAt ?? 'no-turn',
    confirmNewGame ? 'confirm-new' : 'normal'
  ].join(':');

  useEffect(() => {
    setFooterActionsLocked(true);
    const timeout = setTimeout(() => setFooterActionsLocked(false), ACTION_LOCK_MS);
    return () => clearTimeout(timeout);
  }, [actionLockKey]);

  useEffect(() => {
    if (!showInfoPopup) {
      return undefined;
    }
    const timeout = setTimeout(() => setShowInfoPopup(false), 5000);
    return () => clearTimeout(timeout);
  }, [showInfoPopup]);

  const startNewGame = async () => {
    setConfirmNewGame(false);
    setSavedRecord(null);
    setError('');
    await clearSavedState();
    setSnapshot(createInitialSnapshot('counts'));
  };

  const resumeSavedGame = () => {
    if (!savedRecord) {
      return;
    }
    setConfirmNewGame(false);
    setError('');
    setSnapshot(savedRecord.snapshot);
  };

  const exitToLanding = () => {
    setConfirmNewGame(false);
    setError('');
    void persistSnapshot(snapshot);
    setSnapshot((current) => ({ ...current, step: 'landing' }));
  };

  const regenerateSetup = (playerCount: number, teamCount: number) => {
    const setupError = getHatGameSetupError({ playerCount, teamCount });
    if (setupError) {
      setError(setupError);
      return;
    }
    const { teams, players } = buildDefaultSetup(playerCount, teamCount);
    setSnapshot((current) => ({
      ...current,
      step: 'team',
      teamEditIndex: 0,
      playerCount,
      teamCount,
      teams,
      players,
      clueSubmissions: syncClueSubmissions(players, {}),
      session: null
    }));
    setError('');
  };

  const updatePlayerCount = (playerCount: number) => {
    setSnapshot((current) => ({ ...current, playerCount }));
  };

  const updateTeamCount = (teamCount: number) => {
    setSnapshot((current) => ({ ...current, teamCount }));
  };

  const updateTeamName = (teamId: string, name: string) => {
    setSnapshot((current) => ({
      ...current,
      teams: current.teams.map((team) =>
        team.id === teamId ? { ...team, name: name.slice(0, GAME_DEFAULTS.maxNameLength) } : team
      )
    }));
  };

  const updatePlayerName = (playerId: string, name: string) => {
    setSnapshot((current) => ({
      ...current,
      players: current.players.map((player) =>
        player.id === playerId ? { ...player, name: name.slice(0, GAME_DEFAULTS.maxNameLength) } : player
      )
    }));
  };

  const updateClue = (playerId: string, clueIndex: number, value: string) => {
    setSnapshot((current) => ({
      ...current,
      clueSubmissions: {
        ...current.clueSubmissions,
        [playerId]: {
          clues: (current.clueSubmissions[playerId]?.clues ?? createEmptyClues()).map((clue, index) =>
            index === clueIndex ? value.slice(0, GAME_DEFAULTS.maxClueLength) : clue
          )
        }
      }
    }));
  };

  const fillSuggestion = (playerId: string, clueIndex: number) => {
    const used = Object.values(snapshotRef.current.clueSubmissions).flatMap((entry) =>
      entry.clues.map((clue) => clue.trim()).filter(Boolean)
    );
    updateClue(playerId, clueIndex, chooseSuggestion(used));
  };

  const confirmTeamStep = () => {
    if (!activeTeam) {
      return;
    }
    if (!activeTeam.name.trim() || activeTeamPlayers.some((player) => !player.name.trim())) {
      setError('Name the team and every player before continuing.');
      return;
    }
    setError('');
    setSnapshot((current) => ({
      ...current,
      teamEditIndex: current.teamEditIndex + 1,
      step: current.teamEditIndex >= current.teams.length - 1 ? 'review' : 'team'
    }));
  };

  const backTeamStep = () => {
    setSnapshot((current) => ({
      ...current,
      step: current.teamEditIndex === 0 ? 'counts' : 'team',
      teamEditIndex: Math.max(0, current.teamEditIndex - 1)
    }));
  };

  const editTeams = () => {
    setSnapshot((current) => ({ ...current, step: 'team', teamEditIndex: 0 }));
  };

  const startClueEntry = () => {
    const setupError = getHatGameSetupError({
      playerCount: snapshot.playerCount,
      teamCount: snapshot.teamCount,
      teams: snapshot.teams,
      players: snapshot.players
    });
    if (setupError) {
      setError(setupError);
      return;
    }
    setSnapshot((current) => ({
      ...current,
      step: 'clues',
      clueEntryIndex: 0,
      clueEntryRevealed: false,
      clueSubmissions: syncClueSubmissions(current.players, current.clueSubmissions)
    }));
    setError('');
  };

  const revealClueEntry = () => {
    setSnapshot((current) => ({ ...current, clueEntryRevealed: true }));
  };

  const confirmClues = () => {
    const player = snapshot.players[snapshot.clueEntryIndex];
    if (!player) {
      return;
    }
    const clues = snapshot.clueSubmissions[player.id]?.clues ?? createEmptyClues();
    if (clues.some((clue) => clue.trim().length === 0)) {
      setError(`Fill in every famous figure before handing the phone on from ${player.name}.`);
      return;
    }
    if (snapshot.clueEntryIndex >= snapshot.players.length - 1) {
      const session = createHatGameSession({
        players: snapshot.players,
        teams: snapshot.teams,
        config: GAME_DEFAULTS,
        clueSubmissions: snapshot.clueSubmissions
      });
      setSnapshot((current) => ({ ...current, step: 'game', session, handoffRevealed: false }));
    } else {
      setSnapshot((current) => ({
        ...current,
        clueEntryIndex: current.clueEntryIndex + 1,
        clueEntryRevealed: false
      }));
    }
    setError('');
  };

  const revealHandoff = () => {
    setSnapshot((current) => ({ ...current, handoffRevealed: true }));
  };

  const playAgain = () => {
    const session = createHatGameSession({
      players: snapshot.players,
      teams: snapshot.teams,
      config: GAME_DEFAULTS,
      clueSubmissions: snapshot.clueSubmissions
    });
    setSnapshot((current) => ({ ...current, step: 'game', session, handoffRevealed: false }));
  };

  return {
    appVersion: packageJson.version,
    snapshot,
    savedRecord,
    loaded,
    error,
    secondsRemaining,
    confirmNewGame,
    footerActionsLocked,
    showInfoPopup,
    activeTeam,
    activeTeamPlayers,
    setConfirmNewGame,
    setShowInfoPopup,
    startNewGame,
    resumeSavedGame,
    exitToLanding,
    regenerateSetup,
    updatePlayerCount,
    updateTeamCount,
    updateTeamName,
    updatePlayerName,
    updateClue,
    fillSuggestion,
    confirmTeamStep,
    backTeamStep,
    editTeams,
    startClueEntry,
    revealClueEntry,
    confirmClues,
    revealHandoff,
    dispatchGameAction,
    playAgain
  };
}

export type HatGameAppController = ReturnType<typeof useHatGameApp>;

