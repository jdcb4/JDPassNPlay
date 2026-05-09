# Fallow remediation plan

Working list from `pnpm dlx fallow --no-cache --format human` (session start). Items are checked off as completed.

## Wave 1 — actionable hygiene

- [x] **W1-1** Remove unused devDependency `globals` (not referenced in eslint.config or source).
- [ ] **W1-2** Deduplicate leaderboard construction: shared helper in `src/domain/shared/`, used by Hat Game `teamUtils` and WhoWhatWhere `game.ts` (`buildResults`).

## Deferred / monitor (not blocking)

- **Optional native package:** Fallow postinstall may warn about `@fallow-cli/win32-x64-msvc`; optional binary install — environmental, not a code defect.
- **Complexity / large functions:** Fallow lists many “above threshold” functions (large hooks, `applyHatGameAction`, etc.). Address only when a change touches that code or a focused refactor improves readability without splitting orchestration unnecessarily.

## Verification

Per `docs/VERIFICATION.md`: `pnpm run typecheck`, `pnpm test`, `pnpm run lint`, `pnpm run build` before each commit.
