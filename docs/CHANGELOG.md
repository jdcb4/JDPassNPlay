# Changelog

Notable changes by version. Newest at the top. Bumps follow `docs/VERSIONING.md`.

## 0.3.1 - 2026-05-10

- **Hat Game (turn):** Metrics use the same **2×2** grid as WhoWhatWhere (time left, phase name, score, skipped-waiting count). Skipped-clues panel includes the helper line “Pick a waiting word to return to it now.”
- **Who What Where (between turns):** Ready screen matches Hat-style **single outer `GamePanel`**; scoreboard uses shared **`GameScoreboard`** (Hat list UX); **`LastTurnCard`** recap uses muted rounded panel styling with collapsible words preserved.

## 0.3.0 - 2026-05-10

- **Shared chrome:** `FooterActionLockContext` + `GameFooterButtons` (`PrimaryFooterButton`, `SecondaryFooterButton`, etc.), `GamePanel`, `TurnPlayHighlight`, `GameScreenHeaderActions`. Hat Game renamed from hat-only context; shell wraps full game so in-flow controls respect the same brief footer lock as primary actions.
- **Hat Game:** Removed duplicate header **Exit** (Home covers leaving). Skip/Correct use outline + primary styling with icons; skip uses secondary/outline for parity with WWW.
- **Who What Where:** Primary flows use `GameShell` sticky footer (settings, resume, ready handoff, turn Skip/Correct, final summary, results). **End turn** moved to header like Hat Game. Active turn UI aligned with Hat (`GamePanel`, shaded highlight, dashed skipped list, 2×2 metrics kept). Ready flow uses lifted handoff state + same footer lock timing as Hat (`FOOTER_ACTION_LOCK_MS`).
- **Removed:** `hatActionLockContext.tsx` (superseded by shared footer context).

## 0.2.9 - 2026-05-10

- **Hat Game (UI):** Moved dispatch sound cues into `hatGameActionSound.ts` with unit tests; `useHatGameApp` delegates to `playHatGameActionSoundEffects` after a successful engine transition.

## 0.2.8 - 2026-05-10

- **Hat Game (domain):** Refactored `applyHatGameAction` — extracted `buildActionRuntime` and `applyTurnInteractionAction` so routing vs mid-turn logic is easier to follow (no behaviour change).

## 0.2.7 - 2026-05-10

- **Tooling:** Added `pnpm run fallow:hygiene` (dead-code + duplication only). Documented in `docs/VERIFICATION.md` how full Fallow differs from the hygiene subset when interactive complexity thresholds are noisy.

## 0.2.6 - 2026-05-10

- **Domain:** Shared `buildLeaderboardRowsFromTeams` in `src/domain/shared/teamLeaderboard.ts` — removes duplicated sort/map logic between Hat Game and WhoWhatWhere (Fallow duplication scan).

## 0.2.5 - 2026-05-10

- **Tooling:** Removed unused `globals` devDependency (Fallow unused-deps scan); added `docs/FALLOW_PLAN.md` to track hygiene follow-ups from Fallow.

## 0.2.4 - 2026-05-09

- **Repo:** Removed optional `_reference/` upstream clone folder (local-only; was gitignored). Dropped `_reference` from ESLint, Vitest, Fallow, and `.gitignore`; updated `docs/PROJECT_INDEX.md`.

## 0.2.3 - 2026-05-09

- **Hat Game setup:** Matches WhoWhatWhere — pick 2–4 teams first, then step through each team with 2–6 players per team (starts at 2; add/remove like WWW).
- **Shared UI:** `TeamCountOptionGroup`, `TeamRosterSetupScreen`, `OptionGroup` under `src/components/`; roster limits in `src/config/teamRoster.ts`.
- **App info:** Shared `AppInfoOverlay` + `AppInfoHeaderButton` — both games show **JDPassNPlay** and package version (WhoWhatWhere replaces header sparkles with the same “i” control as Hat Game).

## 0.2.2 - 2026-05-09

- **GitHub Pages:** Set Vite `base` to `/JDPassNPlay/` so asset URLs match the repository path (fixes blank page when the repo name casing differs from `/jdpassnplay/`).
- **GitHub Pages:** After `build:pages`, copy `index.html` to `404.html` so SPA routes work on refresh and direct links.

## 0.2.1 - 2026-05-09

- WhoWhatWhere team setup: removed footer negative margins that caused horizontal scroll; tightened player rows with `min-w-0` / `overflow-x-hidden`.
- Hat Game results footer: full-width stacked actions (match WhoWhatWhere); footer always uses a single column.
- Clear persisted match when a game reaches **final results** (WhoWhatWhere + Hat Game) so **Resume** only applies to in-progress play; stale completed saves are discarded on load.
- Hat Game phase cues use bundled `OneWord.wav` and `Charades.wav` (from `src/assets/audio/`).

## 0.2.0 - 2026-05-09

- Hub home screen with cards for **Who What Where**, **Hat Game**, and a placeholder **Imposter** route.
- Ported **WhoWhatWhere** domain, UI, `localStorage` persistence, and Web Audio cues from the reference project; final results offer **Pick another game**, **Replay**, and **New game**.
- Reimplemented **Hat Game** from the Expo reference as a web feature (same rules engine and JSON data); local persistence; short Web Audio cues for most events; same three result actions.
- Shared **GameShell** layout (safe areas + keyboard-friendly scroll margins) and `GameResultActions` for consistent mobile-first UX.
- **Deferred / follow-up:** Imposter is stub-only.

## 0.1.0 - 2026-01-01

- Initial scaffold from the Project Initiation `client-only` preset.
