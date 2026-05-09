# Architecture — JDPassNPlay

## Runtime shape

**Client-only React (Vite)** SPA. **React Router** drives:

- `/` — game picker (home).
- `/games/whowhatwhere` — WhoWhatWhere pass-and-play flow.
- `/games/hat` — Hat Game pass-and-play flow.
- `/games/imposter` — placeholder third game.

State persists in **`localStorage`** per game (isolated keys). **Web Audio API** generates short UI cues (no external audio assets for Hat Game in this port).

Deploy targets: GitHub Pages, Docker (`pnpm run docker:build`).

## Module boundaries

Use clear layers. Adapt the names if the project demands it, but keep the separation.

### Game screen layout (`GamePanel`)

Use `@/components/game/GamePanel` as the **default wrapper for primary in-game content** on each screen inside `GameShell`: titled card (`bg-card`, border, rounded corners) with optional eyebrow and subtitle. Both Hat Game and Who What Where follow this; Imposter uses it on the placeholder route. When adding a new game route, wrap each step’s main body in `GamePanel` unless a deliberate exception is documented in `docs/DECISIONS.md`.

Shared roster UI (`TeamRosterSetupScreen`) can hide its built-in heading (`omitHeading`) when the parent supplies headings via `GamePanel`.

### Typography tiers (`text-typ-*`)

Use **named font tiers** (`text-typ-ui`, `text-typ-panel-title`, …) backed by CSS variables — see [`docs/TYPOGRAPHY.md`](TYPOGRAPHY.md). Prefer these over raw `text-sm` / `text-xl` / `tracking-*` in components.

### Semantic colors (`semantic-*`)

Use **semantic theme tokens** for tinted surfaces, soft borders, scrims, and dev-gallery chrome — see [`docs/THEMING.md`](THEMING.md). Prefer `bg-semantic-*` / `border-semantic-*` over primitives with `/opacity` Tailwind modifiers; opacity math lives in theme CSS only.

- `src/app` — routing, app shell, framework entrypoints.
- `src/features` — feature-specific UI and orchestration.
- `src/components/ui` — generic visual primitives.
- `src/components` — small reusable app components shared across features.
- `src/domain` — framework-independent business rules. Free of React, IO, and database imports.
- `src/services` — IO wrappers (storage, HTTP, filesystem).
- `src/data` — local data, JSON files, fixtures.
- `src/config` — typed config + environment parsing (Zod).
- `src/lib` — small generic helpers without domain knowledge.
- `src/tests` — shared test utilities and integration tests.

## Boundary rules

- Domain code does not import React, frameworks, filesystem, or database modules unless explicitly required.
- UI components do not own persistence or network calls.
- IO sits behind service modules so it can be mocked or swapped in tests.
- Feature orchestration is separate from pure domain rules.
- Inject time, randomness, IDs, and external services when deterministic tests need control.

## Persistence

Default: JSON files in `src/data/` validated with Zod on load. Move to a database only when JSON is unsuitable, and document the migration in `docs/DECISIONS.md`.

When a database is needed:

- Drizzle ORM, with SQLite for development and Postgres for production.
- Schemas in `src/db/schema.ts` (or `apps/server/src/db/schema.ts` in monorepo presets).
- Migrations in `drizzle/`.
- Seed scripts under `scripts/`.

## Validation

Zod is the validation default. Validate every external input: forms, URL params, request bodies, environment variables, JSON file loads, third-party API responses, Socket.io events.

## Configuration

Environment variables flow through a Zod schema in `src/config/env.ts`. Missing or malformed values must fail fast at startup.

## Testing

- Vitest with `jsdom` for component tests, `node` for domain/server tests.
- React Testing Library for component behaviour.
- Deterministic unit tests for domain logic. Integration tests for important flows.
- Inject fakes for time, randomness, IDs.

## Deployment

See `docs/DEPLOYMENT.md`.
