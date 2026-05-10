/* eslint-disable react-refresh/only-export-components -- screen builder module; not a leaf component file */
import type { NavigateFunction } from "react-router-dom";

import { FINAL_TURN_RECAP_NEXT_STEPS } from "@/components/game/finalTurnRecapCopy";
import {
  FooterIconSlotButton,
  FooterOutlineIconTextButton,
  PrimaryFooterButton,
  SecondaryFooterButton,
} from "@/components/game/GameFooterButtons";
import { GamePanel } from "@/components/game/GamePanel";
import { GameScoreboard } from "@/components/game/GameScoreboard";
import { HatLastTurnCard } from "@/components/game/HatLastTurnCard";
import { ReadyNextStepsCard } from "@/components/game/ReadyNextStepsCard";
import { ReadyProgressCard } from "@/components/game/ReadyProgressCard";
import { ResumeGameCard } from "@/components/game/ResumeGameCard";
import { reviewDisplayRowsFromHat } from "@/components/game/reviewTeamMappers";
import { ReviewTeamsPanel } from "@/components/game/ReviewTeamsPanel";
import { ThatsTheLastTurnCard } from "@/components/game/ThatsTheLastTurnCard";
import { TurnPlayHighlight } from "@/components/game/TurnPlayHighlight";
import { GameResultActions } from "@/components/GameResultActions";
import { IconCheck, IconSkipForward } from "@/components/icons";
import { Metric } from "@/components/Metric";
import { OptionButton, OptionGroup } from "@/components/setup/OptionGroup";
import {
  TeamCountOptionGroup,
} from "@/components/setup/TeamCountOptionGroup";
import { teamRosterAdvanceLabel } from "@/components/team-setup/teamRosterLabels";
import { TeamRosterSetupScreen } from "@/components/team-setup/TeamRosterSetupScreen";
import { GAME_DEFAULTS } from "@/config/hatGameDefaults";
import type { SharedTeamCount } from "@/config/teamRoster";
import {
  getHatGameContext,
  getHatGamePhaseMeta,
} from "@/domain/hat-game/engine";
import { hatStateToRosterRows } from "@/domain/hat-game/setup";
import { formatCountdown } from "@/domain/hat-game/time";
import type { HatGameSession } from "@/domain/hat-game/types";
import type { ScreenModel } from "@/features/hat-game/hatGameAppTypes";
import type { HatGameAppController } from "@/features/hat-game/useHatGameApp";
import { formatSavedAt } from "@/lib/formatSavedAt";

function HatScoreboard({ session }: { session: HatGameSession }) {
  const highlightTeamId = session.lastTurnSummary?.teamId;

  return (
    <GameScoreboard
      {...(highlightTeamId ? { highlightTeamId } : {})}
      sortDescendingByScore={false}
      teams={session.teams.map((team) => ({
        id: team.id,
        name: team.name,
        score: team.score,
      }))}
    />
  );
}

const inputClassName =
  "keyboard-safe-input h-12 w-full rounded-md border border-input bg-background px-3 text-typ-input text-foreground outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring";

const noticeClass = "text-typ-ui text-muted-foreground";

const reviewCardClass =
  "rounded-lg border border-border bg-semantic-muted-panel-bg p-3 text-typ-ui";

const renderLanding = (controller: HatGameAppController): ScreenModel => ({
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
});

const renderSettings = (controller: HatGameAppController): ScreenModel => ({
  content: (
    <GamePanel
      subtitle="Choose teams, timing, skips, and how setup continues before rounds."
      title="Game settings"
    >
      <TeamCountOptionGroup
        value={controller.snapshot.teamCount as SharedTeamCount}
        onChange={controller.updateHatTeamCountSetting}
      />

      <OptionGroup label="Turn length">
        {[30, 45, 60, 75].map((seconds) => (
          <OptionButton
            key={seconds}
            selected={controller.snapshot.turnDurationSeconds === seconds}
            onClick={() => controller.updateHatTurnDurationSeconds(seconds)}
          >
            {seconds}s
          </OptionButton>
        ))}
      </OptionGroup>

      <OptionGroup label="Skips per turn">
        {[1, 2, 3].map((skips) => (
          <OptionButton
            key={skips}
            selected={controller.snapshot.skipsPerTurn === skips}
            onClick={() => controller.updateHatSkipsPerTurn(skips)}
          >
            {skips}
          </OptionButton>
        ))}
      </OptionGroup>
    </GamePanel>
  ),
  actions: (
    <PrimaryFooterButton
      label="Next: Team 1"
      onClick={() => controller.confirmTeamCountAndStartTeamSetup()}
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
      <GamePanel
        className="flex min-h-0 flex-1 flex-col"
        eyebrow={`Team ${controller.snapshot.teamEditIndex + 1} of ${controller.snapshot.teamCount}`}
        subtitle="Edit the roster below. At least two players per team; add seats if needed."
        title="Name this team"
      >
        <TeamRosterSetupScreen
          addPlayerToRoster={controller.addPlayerToHatRosterRows}
          error={controller.error}
          omitHeading
          removePlayerFromRoster={controller.removePlayerFromHatRosterRows}
          teamCount={controller.snapshot.teamCount}
          teamIndex={controller.snapshot.teamEditIndex}
          teams={rosterRows}
          onBack={controller.backTeamStep}
          onTeamsChange={controller.applyHatRosterFromRows}
        />
      </GamePanel>
    ),
    actions: (
      <PrimaryFooterButton
        label={teamRosterAdvanceLabel(
          controller.snapshot.teamEditIndex,
          controller.snapshot.teamCount,
          "Review teams",
        )}
        onClick={controller.confirmTeamStep}
      />
    ),
  };
};

const renderReview = (controller: HatGameAppController): ScreenModel => ({
  content: (
    <section className="keyboard-safe-form flex flex-1 flex-col gap-4 pb-4">
      <GamePanel title="Review teams">
        <ReviewTeamsPanel
          teams={reviewDisplayRowsFromHat(
            controller.snapshot.teams,
            controller.snapshot.players,
          )}
        />
      </GamePanel>
      <GamePanel subtitle="Private clue entry" title="Next steps">
        <p className="text-typ-body text-muted-foreground">
          Pass the phone around for private famous figure entry after this.
        </p>
      </GamePanel>
    </section>
  ),
  actions: (
    <>
      <SecondaryFooterButton label="Edit teams" onClick={controller.editTeams} />
      <PrimaryFooterButton
        label="Start famous figure entry"
        onClick={controller.startClueEntry}
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
        <GamePanel
          subtitle={`Figure pack ${controller.snapshot.clueEntryIndex + 1} of ${controller.snapshot.players.length}`}
          title={`Pass to ${player.name}`}
        >
          <p className={noticeClass}>
            Only {player.name} should look at the screen for this step.
          </p>
        </GamePanel>
      ),
      actions: (
        <PrimaryFooterButton
          label={`${player.name} ready`}
          onClick={controller.revealClueEntry}
        />
      ),
    };
  }

  return {
    content: (
      <GamePanel
        subtitle="Enter people or characters most players could know."
        title={`${player.name}'s famous figures`}
      >
        {clues.map((clue, index) => (
          <div
            key={`${player.id}-clue-${index}`}
            className="flex flex-wrap items-center gap-2"
          >
            <span className="w-6 shrink-0 font-medium tabular-nums text-typ-ui">
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
            <FooterIconSlotButton
              icon={<span aria-hidden="true">⚡</span>}
              label="Lightning suggestion"
              onClick={() => controller.fillSuggestion(player.id, index)}
            />
          </div>
        ))}
      </GamePanel>
    ),
    actions: (
      <PrimaryFooterButton
        label={
          controller.snapshot.clueEntryIndex >=
          controller.snapshot.players.length - 1
            ? "Confirm and start game"
            : "Confirm and pass on"
        }
        onClick={controller.confirmClues}
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

  const nextStepsPrimary = phase.instruction;

  const nextStepsGivePhone = controller.snapshot.handoffRevealed ? (
    <>
      <span className="font-semibold text-foreground">
        {context.activeDescriberName}
      </span>{" "}
      has the phone — start the turn from the footer when everyone is ready.
    </>
  ) : (
    <>
      Give the phone to{" "}
      <span className="font-semibold text-foreground">
        {context.activeDescriberName}
      </span>
      .
    </>
  );

  return {
    content: (
      <section className="flex flex-1 flex-col gap-4 pb-4">
        <GamePanel
          title={`${context.activeTeam?.name ?? "Next team"} up next`}
        />

        {previousTurn ? <HatLastTurnCard summary={previousTurn} /> : null}

        <ReadyProgressCard label="Phase">
          {session.phaseNumber}: {phase.name}
        </ReadyProgressCard>

        <HatScoreboard session={session} />

        <ReadyNextStepsCard
          givePhoneLine={nextStepsGivePhone}
          primaryText={nextStepsPrimary}
        />
      </section>
    ),
    actions: controller.snapshot.handoffRevealed ? (
      <PrimaryFooterButton
        label="Start turn"
        onClick={() =>
          controller.dispatchGameAction({ type: "start-turn" })
        }
      />
    ) : (
      <PrimaryFooterButton
        label={`${context.activeDescriberName} Ready`}
        onClick={controller.revealHandoff}
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
      <GamePanel
        subtitle={`${context.activeDescriberName} is presenting`}
        title={`${context.activeTeam?.name ?? "Team"} guessing`}
      >
        <TurnPlayHighlight>{currentClue}</TurnPlayHighlight>
        <div className="grid grid-cols-2 gap-3">
          <Metric
            label="Time left"
            value={formatCountdown(controller.secondsRemaining)}
          />
          <Metric label="Phase" value={phase.name} />
          <Metric label="Score" value={String(activeTurn?.score ?? 0)} />
          <Metric
            label="Skipped waiting"
            value={String(activeTurn?.skippedClues.length ?? 0)}
          />
        </div>
        <p className={noticeClass}>
          Phase {session.phaseNumber}: {phase.name}. {phase.instruction}
        </p>
        {activeTurn?.skippedClues.length ? (
          <div className="rounded-lg border border-dashed border-border p-3">
            <p className="mb-2 text-typ-ui font-semibold">Skipped famous figures</p>
            <p className="mb-3 text-typ-ui text-muted-foreground">
              Pick a waiting word to return to it now.
            </p>
            <div className="grid gap-2">
              {activeTurn.skippedClues.map((clue) => (
                <FooterOutlineIconTextButton
                  key={clue.poolIndex}
                  icon={<span aria-hidden="true">↶</span>}
                  label={clue.text}
                  onClick={() =>
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
      </GamePanel>
    ),
    actions: (
      <>
        <SecondaryFooterButton
          disabled={(activeTurn?.skipsRemaining ?? 0) <= 0}
          icon={<IconSkipForward className="size-5" />}
          label="Skip"
          onClick={() =>
            controller.dispatchGameAction({ type: "skip-clue" })
          }
        />
        <PrimaryFooterButton
          icon={<IconCheck className="size-5" />}
          label="Correct"
          onClick={() =>
            controller.dispatchGameAction({ type: "mark-correct" })
          }
        />
      </>
    ),
  };
};

const renderFinalTurnRecap = (
  controller: HatGameAppController,
  session: HatGameSession,
): ScreenModel => {
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
        onClick={() =>
          controller.dispatchGameAction({ type: "view-results" })
        }
      />
    ),
  };
};

const renderResults = (
  controller: HatGameAppController,
  session: HatGameSession,
  navigate: NavigateFunction,
): ScreenModel => ({
  content: (
    <GamePanel
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
          <p className="mt-1 text-typ-ui text-muted-foreground">{entry.score} pts</p>
        </div>
      ))}
    </GamePanel>
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
  if (session.stage === "finalSummary") {
    return renderFinalTurnRecap(controller, session);
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
        <GamePanel subtitle="Loading saved game…" title="Hat Game" />
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