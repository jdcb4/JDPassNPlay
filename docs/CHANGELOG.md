# Changelog

Notable changes by version. Newest at the top. Bumps follow `docs/VERSIONING.md`.

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
- Vitest excludes `_reference/` clones; ESLint ignores `_reference/`.
- **Deferred / follow-up:** Imposter is stub-only. Delete `_reference/` when you no longer need the upstream clones locally.

## 0.1.0 - 2026-01-01

- Initial scaffold from the Project Initiation `client-only` preset.
