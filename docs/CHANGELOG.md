# Changelog

Notable changes by version. Newest at the top. Bumps follow `docs/VERSIONING.md`.

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
