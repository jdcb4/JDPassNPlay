/* eslint-disable react-refresh/only-export-components -- screen builder module; not a leaf component file */
import { type ReactNode, useContext } from "react";
import type { NavigateFunction } from "react-router-dom";

import { GameResultActions } from "@/components/GameResultActions";
import { Metric } from "@/components/Metric";
import {
  TeamCountOptionGroup,
} from "@/components/setup/TeamCountOptionGroup";
import { TeamRosterSetupScreen } from "@/components/team-setup/TeamRosterSetupScreen";
import { Button } from "@/components/ui/button";
import { GAME_DEFAULTS } from "@/config/hatGameDefaults";
import type { SharedTeamCount } from "@/config/teamRoster";
import { teamCountRosterHint } from "@/config/teamRoster";
import {
  getHatGameContext,
  getHatGamePhaseMeta,
} from "@/domain/hat-game/engine";
import { hatStateToRosterRows } from "@/domain/hat-game/setup";
import { formatCountdown } from "@/domain/hat-game/time";
import type { HatGameSession } from "@/domain/hat-game/types";
import { HatActionLockContext } from "@/features/hat-game/hatActionLockContext";
import type { ScreenModel } from "@/features/hat-game/hatGameAppTypes";
import type { HatGameAppController } from "@/features/hat-game/useHatGameApp";
import { formatSavedAt } from "@/features/hat-game/useHatGameApp";

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      <div className="grid gap-4">{children}</div>
    </div>
  );
}

function HatScoreboard({ session }: { session: HatGameSession }) {
  return (
    <div className="space-y-2 rounded-lg border border-border bg-background p-3">
      <p className="text-sm font-semibold">Scoreboard</p>
      <ul className="space-y-2">
        {session.teams.map((team) => (
          <li
            key={team.id}
            className="flex items-center justify-between text-sm font-medium"
          >
            <span>{team.name}</span>
            <span className="tabular-nums text-muted-foreground">
              {team.score} pts
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PrimaryButton({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const footerLocked = useContext(HatActionLockContext);
  return (
    <Button
      className="h-12 w-full min-w-0"
      disabled={disabled || footerLocked}
      onClick={onPress}
      type="button"
    >
      {label}
    </Button>
  );
}

function SecondaryButton({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const footerLocked = useContext(HatActionLockContext);
  return (
    <Button
      className="h-12 w-full min-w-0"
      disabled={disabled || footerLocked}
      onClick={onPress}
      type="button"
      variant="outline"
    >
      {label}
    </Button>
  );
}

function IconButton({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: string;
  onPress: () => void;
}) {
  const footerLocked = useContext(HatActionLockContext);
  return (
    <Button
      aria-label={label}
      className="h-12 shrink-0 px-3"
      disabled={footerLocked}
      onClick={onPress}
      type="button"
      variant="secondary"
    >
      <span aria-hidden="true">{icon}</span>
    </Button>
  );
}

function IconTextButton({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress: () => void;
}) {
  const footerLocked = useContext(HatActionLockContext);
  return (
    <Button
      className="h-auto min-h-12 w-full justify-start gap-2 py-3 text-left"
      disabled={footerLocked}
      onClick={onPress}
      type="button"
      variant="outline"
    >
      <span aria-hidden="true">{icon}</span>
      <span className="break-words">{label}</span>
    </Button>
  );
}

const inputClassName =
  "keyboard-safe-input h-12 w-full rounded-md border border-input bg-background px-3 text-base text-foreground outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring";

const noticeClass = "text-sm text-muted-foreground";

const reviewCardClass =
  "rounded-lg border border-border bg-muted/20 p-3 text-sm";

const renderLanding = (controller: HatGameAppController): ScreenModel => ({
  content: (
    <Panel
      subtitle="A pass-and-play Celebrity-style party game. Add famous figures, split into teams, then race through Describe, One Word, and Charades with the same figure pool."
      title="Hat Game"
    >
      {controller.savedRecord ? (
        <p className={noticeClass}>
          Saved game found from{" "}
          {formatSavedAt(controller.savedRecord.lastSavedAt)}.
        </p>
      ) : (
        <p className={noticeClass}>
          No accounts and no server. One phone, a few friends, and a hat full
          of names.
        </p>
      )}
      {controller.confirmNewGame ? (
        <p className="text-sm font-medium text-destructive">
          Start a new game? This will discard the saved game on this device.
        </p>
      ) : null}
    </Panel>
  ),
  actions: controller.confirmNewGame ? (
    <>
      <SecondaryButton
        label="Cancel"
        onPress={() => controller.setConfirmNewGame(false)}
      />
      <PrimaryButton
        label="Discard and start"
        onPress={() => void controller.startNewGame()}
      />
    </>
  ) : controller.savedRecord ? (
    <>
      <SecondaryButton
        label="New game"
        onPress={() => controller.setConfirmNewGame(true)}
      />
      <PrimaryButton label="Resume game" onPress={controller.resumeSavedGame} />
    </>
  ) : (
    <PrimaryButton
      label="Start game"
      onPress={() => void controller.startNewGame()}
    />
  ),
});

const renderSettings = (controller: HatGameAppController): ScreenModel => ({
  content: (
    <Panel
      subtitle="Choose how many teams are playing. Next you will name each team and its players (2–6 per team)."
      title="Set up Hat Game"
    >
      <TeamCountOptionGroup
        value={controller.snapshot.teamCount as SharedTeamCount}
        onChange={controller.updateHatTeamCountSetting}
      />
      <p className={noticeClass}>
        {teamCountRosterHint(controller.snapshot.teamCount)}
      </p>
    </Panel>
  ),
  actions: (
    <PrimaryButton
      label="Next: Team 1"
      onPress={() => controller.confirmTeamCountAndStartTeamSetup()}
    />
  ),
});

const renderTeamEditor = (controller: HatGameAppController): ScreenModel => {
  const rosterRows = hatStateToRosterRows(
    controller.snapshot.teams,
    controller.snapshot.players,
  );

  return {
    content: (
      <TeamRosterSetupScreen
        addPlayerToRoster={controller.addPlayerToHatRosterRows}
        error={controller.error}
        lastTeamPrimaryLabel="Review teams"
        removePlayerFromRoster={controller.removePlayerFromHatRosterRows}
        teamCount={controller.snapshot.teamCount}
        teamIndex={controller.snapshot.teamEditIndex}
        teams={rosterRows}
        onBack={controller.backTeamStep}
        onNext={controller.confirmTeamStep}
        onTeamsChange={controller.applyHatRosterFromRows}
      />
    ),
  };
};

const renderReview = (controller: HatGameAppController): ScreenModel => ({
  content: (
    <Panel
      subtitle="Pass the phone around for private famous figure entry after this."
      title="Review teams"
    >
      {controller.snapshot.teams.map((team) => (
        <div key={team.id} className={reviewCardClass}>
          <p className="font-semibold">{team.name}</p>
          <p className="mt-1 text-muted-foreground">
            {controller.snapshot.players
              .filter((player) => player.teamId === team.id)
              .map((player) => player.name)
              .join(", ")}
          </p>
        </div>
      ))}
    </Panel>
  ),
  actions: (
    <>
      <SecondaryButton label="Edit teams" onPress={controller.editTeams} />
      <PrimaryButton
        label="Start famous figure entry"
        onPress={controller.startClueEntry}
      />
    </>
  ),
});

const renderClueEntry = (controller: HatGameAppController): ScreenModel => {
  const player = controller.snapshot.players[controller.snapshot.clueEntryIndex];
  if (!player) {
    return { content: null };
  }

  const clues = controller.snapshot.clueSubmissions[player.id]?.clues ?? [];
  if (!controller.snapshot.clueEntryRevealed) {
    return {
      content: (
        <Panel
          subtitle={`Figure pack ${controller.snapshot.clueEntryIndex + 1} of ${controller.snapshot.players.length}`}
          title={`Pass to ${player.name}`}
        >
          <p className={noticeClass}>
            Only {player.name} should look at the screen for this step.
          </p>
        </Panel>
      ),
      actions: (
        <PrimaryButton
          label={`${player.name} ready`}
          onPress={controller.revealClueEntry}
        />
      ),
    };
  }

  return {
    content: (
      <Panel
        subtitle="Enter people or characters most players could know."
        title={`${player.name}'s famous figures`}
      >
        {clues.map((clue, index) => (
          <div
            key={`${player.id}-clue-${index}`}
            className="flex flex-wrap items-center gap-2"
          >
            <span className="w-6 shrink-0 font-medium tabular-nums">
              {index + 1}.
            </span>
            <input
              className={`${inputClassName} min-w-0 flex-1`}
              maxLength={GAME_DEFAULTS.maxClueLength}
              placeholder="Enter a famous figure"
              value={clue}
              onChange={(event) =>
                controller.updateClue(player.id, index, event.target.value)
              }
            />
            <IconButton
              icon="⚡"
              label="Lightning suggestion"
              onPress={() => controller.fillSuggestion(player.id, index)}
            />
          </div>
        ))}
      </Panel>
    ),
    actions: (
      <PrimaryButton
        label={
          controller.snapshot.clueEntryIndex >=
          controller.snapshot.players.length - 1
            ? "Confirm and start game"
            : "Confirm and pass on"
        }
        onPress={controller.confirmClues}
      />
    ),
  };
};

const renderReady = (
  controller: HatGameAppController,
  session: HatGameSession,
): ScreenModel => {
  const context = getHatGameContext(session);
  const phase = getHatGamePhaseMeta(session.phaseNumber);
  const previousTurn = session.lastTurnSummary;
  const correctLabel =
    previousTurn?.correctCount === 1 ? "correct guess" : "correct guesses";

  return {
    content: (
      <Panel
        subtitle={`Phase ${session.phaseNumber}: ${phase.name}`}
        title={`${context.activeTeam?.name ?? "Next team"} up next`}
      >
        {previousTurn ? (
          <div className={reviewCardClass}>
            <p className="font-semibold">
              {previousTurn.describerName}&apos;s turn is over
            </p>
            <p className="mt-1 text-muted-foreground">
              {previousTurn.describerName} scored {previousTurn.correctCount}{" "}
              {correctLabel} for {previousTurn.teamName}.
            </p>
            {previousTurn.phaseCompleted ? (
              <p className="mt-1 text-muted-foreground">
                Phase {previousTurn.completedPhaseNumber} complete
                {previousTurn.nextPhaseName
                  ? `. Next: ${previousTurn.nextPhaseName}.`
                  : "."}
              </p>
            ) : null}
          </div>
        ) : null}
        <HatScoreboard session={session} />
        <p className={noticeClass}>{phase.instruction}</p>
        <p className={noticeClass}>
          {controller.snapshot.handoffRevealed
            ? `${context.activeDescriberName} has the phone.`
            : `Give the phone to ${context.activeDescriberName}.`}
        </p>
      </Panel>
    ),
    actions: controller.snapshot.handoffRevealed ? (
      <PrimaryButton
        label="Start turn"
        onPress={() =>
          controller.dispatchGameAction({ type: "start-turn" })
        }
      />
    ) : (
      <PrimaryButton
        label={`${context.activeDescriberName} ready`}
        onPress={controller.revealHandoff}
      />
    ),
  };
};

const renderTurn = (
  controller: HatGameAppController,
  session: HatGameSession,
): ScreenModel => {
  const context = getHatGameContext(session);
  const phase = getHatGamePhaseMeta(session.phaseNumber);
  const activeTurn = session.activeTurn;
  const currentClue =
    activeTurn?.clueQueue[activeTurn.queueIndex]?.text ?? "Loading";

  return {
    content: (
      <Panel
        subtitle={`${context.activeDescriberName} is presenting`}
        title={`${context.activeTeam?.name ?? "Team"} guessing`}
      >
        <div className="rounded-xl border-2 border-primary/40 bg-primary/5 p-6 text-center text-2xl font-semibold leading-snug">
          {currentClue}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Metric
            label="Time"
            value={formatCountdown(controller.secondsRemaining)}
          />
          <Metric label="Score" value={String(activeTurn?.score ?? 0)} />
          <Metric label="Skips" value={String(activeTurn?.skipsRemaining ?? 0)} />
        </div>
        <p className={noticeClass}>
          Phase {session.phaseNumber}: {phase.name}. {phase.instruction}
        </p>
        {activeTurn?.skippedClues.length ? (
          <div className="rounded-lg border border-dashed border-border p-3">
            <p className="mb-2 text-sm font-semibold">Skipped famous figures</p>
            <div className="grid gap-2">
              {activeTurn.skippedClues.map((clue) => (
                <IconTextButton
                  key={clue.poolIndex}
                  icon="↶"
                  label={clue.text}
                  onPress={() =>
                    controller.dispatchGameAction({
                      type: "return-skipped-clue",
                      payload: { poolIndex: clue.poolIndex },
                    })
                  }
                />
              ))}
            </div>
          </div>
        ) : null}
      </Panel>
    ),
    actions: (
      <>
        <PrimaryButton
          disabled={(activeTurn?.skipsRemaining ?? 0) <= 0}
          label="Skip"
          onPress={() =>
            controller.dispatchGameAction({ type: "skip-clue" })
          }
        />
        <PrimaryButton
          label="Correct"
          onPress={() =>
            controller.dispatchGameAction({ type: "mark-correct" })
          }
        />
      </>
    ),
  };
};

const renderResults = (
  controller: HatGameAppController,
  session: HatGameSession,
  navigate: NavigateFunction,
): ScreenModel => ({
  content: (
    <Panel
      subtitle="All three phases are complete."
      title={session.results?.isTie ? "Tie game" : "Final leaderboard"}
    >
      {session.results?.bestTurn ? (
        <p className={noticeClass}>
          Best turn: {session.results.bestTurn.describerName} scored{" "}
          {session.results.bestTurn.score} for {session.results.bestTurn.teamName}
          .
        </p>
      ) : null}
      {session.results?.leaderboard.map((entry, index) => (
        <div key={entry.teamId} className={reviewCardClass}>
          <p className="font-semibold">
            {index + 1}. {entry.teamName}
          </p>
          <p className="mt-1 text-muted-foreground">{entry.score} pts</p>
        </div>
      ))}
    </Panel>
  ),
  actions: (
    <GameResultActions
      onNewGame={() => void controller.startNewGame()}
      onPickAnotherGame={() => navigate("/")}
      onReplay={controller.playAgain}
    />
  ),
});

const renderGame = (
  controller: HatGameAppController,
  navigate: NavigateFunction,
): ScreenModel => {
  const session = controller.snapshot.session;
  if (!session) {
    return renderReview(controller);
  }
  if (session.stage === "results") {
    return renderResults(controller, session, navigate);
  }
  if (session.stage === "turn") {
    return renderTurn(controller, session);
  }
  return renderReady(controller, session);
};

export const buildHatGameScreen = (
  controller: HatGameAppController,
  navigate: NavigateFunction,
): ScreenModel => {
  if (!controller.loaded) {
    return {
      content: (
        <Panel subtitle="Loading saved game…" title="Hat Game" />
      ),
    };
  }
  if (controller.snapshot.step === "landing") {
    return renderLanding(controller);
  }
  if (controller.snapshot.step === "settings") {
    return renderSettings(controller);
  }
  if (controller.snapshot.step === "team") {
    return renderTeamEditor(controller);
  }
  if (controller.snapshot.step === "review") {
    return renderReview(controller);
  }
  if (controller.snapshot.step === "clues") {
    return renderClueEntry(controller);
  }
  return renderGame(controller, navigate);
};