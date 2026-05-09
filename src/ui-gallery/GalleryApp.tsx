import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { MemoryRouter, useNavigate } from "react-router-dom";

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
import { buildHatGameScreen } from "@/features/hat-game/HatGameWebScreens";
import type { HatGameAppController } from "@/features/hat-game/useHatGameApp";
import { FinalSummaryScreen } from "@/features/whowhatwhere/results/FinalSummaryScreen";
import { ResultsScreen } from "@/features/whowhatwhere/results/ResultsScreen";
import { SettingsScreen } from "@/features/whowhatwhere/setup/SettingsScreen";
import { TeamSetupScreen } from "@/features/whowhatwhere/setup/TeamSetupScreen";
import { ActiveTurnScreen } from "@/features/whowhatwhere/turn/ActiveTurnScreen";
import { ReadyScreen } from "@/features/whowhatwhere/turn/ReadyScreen";
import {
  createHatGalleryController,
  hatGallerySnapshots,
} from "@/ui-gallery/hatGalleryController";
import {
  wwwGalleryMatchActiveFrozen,
  wwwGalleryMatchFinalSummary,
  wwwGalleryMatchFresh,
  wwwGalleryMatchReadyWithSummary,
  wwwGalleryMatchResults,
  wwwGallerySettings,
  wwwGalleryTeamSetups,
} from "@/ui-gallery/wwwGallerySessions";

const noop = () => undefined;

function footerWrap(node: ReactNode) {
  return <div className="flex w-full flex-col gap-2">{node}</div>;
}

type SlideSpec = {
  readonly label: string;
  readonly hat: () => HatGameAppController;
  readonly wwwContent: () => ReactNode;
  readonly wwwFooter?: () => ReactNode;
  readonly wwwShowEndTurn?: boolean;
};

/** Shared demo settings object so `SettingsScreen` stays controlled without changing values. */
const demoWwwSettings = wwwGallerySettings();

/** Precomputed WWW domain states (deterministic; matches slide pairing). */
const wwwFresh = wwwGalleryMatchFresh();
const wwwAfterTurn = wwwGalleryMatchReadyWithSummary();
const wwwActive = wwwGalleryMatchActiveFrozen();
const wwwFinal = wwwGalleryMatchFinalSummary();
const wwwResults = wwwGalleryMatchResults();

function buildSlides(): readonly SlideSpec[] {
  const teams = wwwGalleryTeamSetups();

  return [
    {
      label: "Home · Game settings",
      // No saved game — pairs with WWW settings as the neutral “start here” step.
      hat: () => createHatGalleryController(hatGallerySnapshots.landing),
      wwwContent: () => (
        <SettingsScreen settings={demoWwwSettings} onChange={noop} />
      ),
      wwwFooter: () =>
        footerWrap(
          <PrimaryFooterButton label="Next: Team 1" onClick={noop} />,
        ),
    },
    {
      label: "Team count · Team 1 roster",
      hat: () => createHatGalleryController(hatGallerySnapshots.settings),
      wwwContent: () => (
        <TeamSetupScreen
          error=""
          settings={demoWwwSettings}
          teamIndex={0}
          teams={teams}
          onBack={noop}
          onNext={noop}
          onTeamsChange={noop}
        />
      ),
      wwwFooter: () =>
        footerWrap(
          <PrimaryFooterButton label="Next: Team 2" onClick={noop} />,
        ),
    },
    {
      label: "Team 1 names · Team 2 roster",
      hat: () => createHatGalleryController(hatGallerySnapshots.teamFirst),
      wwwContent: () => (
        <TeamSetupScreen
          error=""
          settings={demoWwwSettings}
          teamIndex={1}
          teams={teams}
          onBack={noop}
          onNext={noop}
          onTeamsChange={noop}
        />
      ),
      wwwFooter: () =>
        footerWrap(
          <PrimaryFooterButton label="Start local round" onClick={noop} />,
        ),
    },
    {
      label: "Review teams · Round ready (first)",
      hat: () => createHatGalleryController(hatGallerySnapshots.review),
      wwwContent: () => (
        <ReadyScreen
          error=""
          handoffRevealed={false}
          match={wwwFresh}
          onBackToSetup={noop}
        />
      ),
      wwwFooter: () =>
        footerWrap(
          <PrimaryFooterButton label="Describer ready" onClick={noop} />,
        ),
    },
    {
      label: "Private clue pass · Round ready (last turn)",
      hat: () => createHatGalleryController(hatGallerySnapshots.clueHidden),
      wwwContent: () => (
        <ReadyScreen
          error=""
          handoffRevealed={false}
          match={wwwAfterTurn}
          onBackToSetup={noop}
        />
      ),
      wwwFooter: () =>
        footerWrap(
          <PrimaryFooterButton label="Describer ready" onClick={noop} />,
        ),
    },
    {
      label: "Enter clues · Active turn",
      hat: () => createHatGalleryController(hatGallerySnapshots.clueForm),
      wwwContent: () => (
        <ActiveTurnScreen match={wwwActive} onReturnSkipped={noop} />
      ),
      wwwFooter: () =>
        footerWrap(
          <>
            <SecondaryFooterButton
              disabled={!canQueueSkipped(wwwActive.activeTurn!)}
              icon={<IconSkipForward className="size-5" />}
              label="Skip"
              onClick={noop}
            />
            <PrimaryFooterButton
              icon={<IconCheck className="size-5" />}
              label="Correct"
              onClick={noop}
            />
          </>,
        ),
      wwwShowEndTurn: true,
    },
    {
      label: "Between turns (handoff hidden)",
      hat: () =>
        createHatGalleryController(hatGallerySnapshots.readyRecapHandoffOff),
      wwwContent: () => (
        <ReadyScreen
          error=""
          handoffRevealed={false}
          match={wwwAfterTurn}
          onBackToSetup={noop}
        />
      ),
      wwwFooter: () =>
        footerWrap(
          <PrimaryFooterButton label="Describer ready" onClick={noop} />,
        ),
    },
    {
      label: "Between turns (start turn)",
      hat: () =>
        createHatGalleryController(hatGallerySnapshots.readyRecapHandoffOn),
      wwwContent: () => (
        <ReadyScreen
          error=""
          handoffRevealed
          match={wwwAfterTurn}
          onBackToSetup={noop}
        />
      ),
      wwwFooter: () =>
        footerWrap(
          <PrimaryFooterButton label="Start turn" onClick={noop} />,
        ),
    },
    {
      label: "Mid-turn (skipped clues) · Final recap",
      hat: () => createHatGalleryController(hatGallerySnapshots.turnSkips),
      wwwContent: () => <FinalSummaryScreen match={wwwFinal} />,
      wwwFooter: () =>
        footerWrap(
          <PrimaryFooterButton
            icon={<IconChevronRight className="size-5" />}
            label="View final scores"
            onClick={noop}
          />,
        ),
      wwwShowEndTurn: false,
    },
    {
      label: "Final scores · Podium",
      hat: () => createHatGalleryController(hatGallerySnapshots.results),
      wwwContent: () => <ResultsScreen match={wwwResults} />,
      wwwFooter: () =>
        footerWrap(
          <GameResultActions
            onNewGame={noop}
            onPickAnotherGame={noop}
            onReplay={noop}
          />,
        ),
    },
  ];
}

function GalleryChrome() {
  const navigate = useNavigate();
  const slides = useMemo(() => buildSlides(), []);
  const [index, setIndex] = useState(0);

  const slide = slides[index]!;
  const hatController = slide.hat();
  const hatScreen = buildHatGameScreen(hatController, navigate);

  const hatShowEndTurn =
    hatController.snapshot.step === "game" &&
    hatController.snapshot.session?.stage === "turn";

  const hatHeaderRight = (
    <GameScreenHeaderActions
      {...(hatShowEndTurn ? { endTurn: { onClick: noop } } : {})}
    />
  );

  const wwwHeaderRight = (
    <GameScreenHeaderActions
      {...(slide.wwwShowEndTurn
        ? { endTurn: { onClick: noop } }
        : {})}
    />
  );

  const goPrev = () => setIndex((current) => Math.max(0, current - 1));
  const goNext = () =>
    setIndex((current) => Math.min(slides.length - 1, current + 1));

  return (
    <div className="min-h-dvh bg-neutral-950 text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-neutral-950/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Dev UI gallery
          </span>
          <button
            className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent"
            disabled={index === 0}
            type="button"
            onClick={goPrev}
          >
            Back
          </button>
          <button
            className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent"
            disabled={index >= slides.length - 1}
            type="button"
            onClick={goNext}
          >
            Next
          </button>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Slide</span>
            <select
              className="max-w-[min(28rem,calc(100vw-8rem))] rounded-md border border-border bg-background px-2 py-1.5 text-sm"
              value={index}
              onChange={(event) => setIndex(Number.parseInt(event.target.value, 10))}
            >
              {slides.map((entry, slideIndex) => (
                <option key={entry.label} value={slideIndex}>
                  {slideIndex + 1}. {entry.label}
                </option>
              ))}
            </select>
          </label>
          <span className="text-sm text-muted-foreground">
            {index + 1} / {slides.length}
          </span>
        </div>
        <p className="mx-auto mt-2 max-w-6xl text-xs text-muted-foreground">
          Static previews with fake data — footer buttons are visual only (pointer events off).
        </p>
      </header>

      <div className="mx-auto grid max-w-6xl gap-4 px-4 pb-8 pt-4 md:grid-cols-2">
        <section>
          <h2 className="mb-2 text-center text-sm font-medium text-muted-foreground">
            Hat Game
          </h2>
          <div className="pointer-events-none select-none overflow-hidden rounded-lg border border-border bg-background shadow-sm">
            <FooterActionLockContext.Provider value={false}>
              <GameShell footer={hatScreen.actions ? footerWrap(hatScreen.actions) : undefined} headerRight={hatHeaderRight} title="Hat Game">
                {hatController.error &&
                hatController.snapshot.step !== "team" ? (
                  <p className="mb-3 text-sm font-medium text-destructive">
                    {hatController.error}
                  </p>
                ) : null}
                {hatScreen.content}
              </GameShell>
            </FooterActionLockContext.Provider>
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-center text-sm font-medium text-muted-foreground">
            Who What Where
          </h2>
          <div className="pointer-events-none select-none overflow-hidden rounded-lg border border-border bg-background shadow-sm">
            <FooterActionLockContext.Provider value={false}>
              <GameShell
                footer={slide.wwwFooter?.()}
                headerRight={wwwHeaderRight}
                title="Who What Where"
              >
                {slide.wwwContent()}
              </GameShell>
            </FooterActionLockContext.Provider>
          </div>
        </section>
      </div>
    </div>
  );
}

export function GalleryApp() {
  return (
    <MemoryRouter initialEntries={["/"]}>
      <GalleryChrome />
    </MemoryRouter>
  );
}
