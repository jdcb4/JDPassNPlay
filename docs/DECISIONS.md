# Decisions

Durable architecture and tooling decisions for JDPassNPlay. ADR-lite format: each entry is dated, names the decision, the reasoning, and any rejected alternatives.

When adding a new entry, append to the bottom and keep the most recent decisions visible. Do not delete past decisions; supersede them with a new entry that links back.

## Format

```
## YYYY-MM-DD: <decision title>

**Decision:** <one sentence>

**Reasoning:** <why this won>

**Rejected alternatives:** <what else was considered and why not>

**Supersedes:** <link to a prior decision, if applicable>
```

---

## 2026-01-01: Scaffolded from the `client-only` preset

**Decision:** Use the `Client-only React app` defaults from the Project Initiation base.

**Reasoning:** Matches the project's expected shape (GitHub Pages, Docker). Keeps tooling consistent with other projects scaffolded from the same base, reducing context-switching and giving agents predictable structure.

**Rejected alternatives:** Alternative presets in the base were not chosen because they target different deployment shapes or backend requirements.

---

## 2026-05-10: Default `GamePanel` wrapper for game routes

**Decision:** Wrap primary game-route body content (everything inside `GameShell` below the header) in `GamePanel` for consistent card chrome. Apply across Who What Where (including settings, team roster, resume prompt, final summary, results), Imposter placeholder, and Hat Game team roster when paired with `TeamRosterSetupScreen` (`omitHeading`).

**Reasoning:** One visual language for “you are in a game flow”; aligns typography and bordered panels across titles and makes new games straightforward (see `docs/ARCHITECTURE.md`).

**Rejected alternatives:** Leaving mixed `<section>` layouts maintained divergence between setup vs turn screens; replacing `GamePanel` with Tailwind-only duplication would drift over time.
