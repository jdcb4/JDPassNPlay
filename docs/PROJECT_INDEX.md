# Project Index — JDPassNPlay

The first stop for navigating this project.

## What this project is

Mobile-first **pass-and-play party game hub** (client-only React). Pick a game on the home screen, pass one device around the table—no accounts or servers.

Games:

- **Who What Where** — word categories, timed turns, team scores (`/games/whowhatwhere`).
- **Hat Game** — celebrity-style clues in three phases (`/games/hat`).
- **Imposter** — placeholder route only (`/games/imposter`).

## Important folders

- `src/app` — router, root layout, smoke tests.
- `src/features/home` — launcher / game picker.
- `src/features/whowhatwhere` — WhoWhatWhere UI + `useGameController`.
- `src/features/hat-game` — Hat Game web UI + `useHatGameApp`.
- `src/features/imposter` — placeholder screen.
- `src/domain/whowhatwhere` — WhoWhatWhere rules (framework-free).
- `src/domain/hat-game` — Hat Game engine + setup helpers.
- `src/domain/shared` — cross-game types (e.g. roster row shape for setup UI).
- `src/components` — shared UI (`GameShell`, `GamePanel`, `GameResultActions`, `AppInfoOverlay`, `game/` panels, `GameScoreboard`, footer buttons, `EditableName`, `Metric`, `setup/`, `team-setup/`, `ui/button`).
- `src/services` — browser persistence (`whowhatwherePersistence`, `hatGameStorage`) and Web Audio (`whowhatwhereSound`, `hatGameSound`).
- `src/data` — `words.generated.ts`, `clueSuggestions.json`, `namePacks.json`.
- `src/assets` — static assets bundled by Vite (e.g. Hat Game phase `.wav` cues).
- `src/config` — `env.ts`, `hatGameDefaults.ts`, `teamRoster.ts` (shared 2–4 teams, 2–6 players per team), `appMeta.ts` (product label for shared chrome).
- `docs` — durable project documentation.
- `scripts` — deterministic project utility scripts.
- `gallery.html` / `src/ui-gallery/` — dev-only UI gallery (not part of default `pnpm run build`).

## Commands

| Command                 | Purpose                                                  |
| ----------------------- | -------------------------------------------------------- |
| `pnpm run dev`          | Start the development server.                            |
| `pnpm run ui-gallery`   | Dev-only paired-screen preview (`gallery.html`, port 5174). See `docs/UI_GALLERY.md`. |
| `pnpm run typecheck`    | TypeScript checking.                                     |
| `pnpm run lint`         | ESLint.                                                  |
| `pnpm test`             | Vitest once.                                             |
| `pnpm run test:watch`   | Vitest in watch mode.                                    |
| `pnpm run build`        | Production build.                                        |
| `pnpm run build:pages` | GitHub Pages build (`base` + `404.html` for SPA).         |
| `pnpm run verify`       | Typecheck + lint + test + build (commit gate).           |
| `pnpm run fallow:hygiene` | Fallow dead-code + duplication only (see `docs/VERIFICATION.md`). |
| `pnpm dlx fallow ...`   | Full Fallow scan (dead-code, duplication, health metrics). |

## Key docs

- [`AGENTS.md`](../AGENTS.md) — the every-turn agent ruleset.
- [`docs/AGENT_REFERENCE.md`](AGENT_REFERENCE.md) — detailed agent reference.
- [`docs/AGENT_PROMPTS.md`](AGENT_PROMPTS.md) — canonical re-usable task prompts.
- [`docs/ARCHITECTURE.md`](ARCHITECTURE.md) — module boundaries and runtime shape.
- [`docs/VERIFICATION.md`](VERIFICATION.md) — required checks before commit.
- [`docs/UI_GALLERY.md`](UI_GALLERY.md) — dev-only UI gallery for screen previews.
- [`docs/VERSIONING.md`](VERSIONING.md) — version rules.
- [`docs/DECISIONS.md`](DECISIONS.md) — durable decisions (ADR-lite).
- [`docs/ROADMAP.md`](ROADMAP.md) — future ideas only, not active work.
- [`docs/CHANGELOG.md`](CHANGELOG.md) — notable changes by version.
- [`docs/DEPLOYMENT.md`](DEPLOYMENT.md) — deploy instructions.
- [`SECURITY.md`](../SECURITY.md) — security rules.
