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

---

## 2026-05-10: Named typography tiers (`text-typ-*`)

**Decision:** Define font size, line-height, and letter-spacing as CSS variables (`--font-tier-*` on `:root`) and expose them through Tailwind as `text-typ-{tier}` utilities, with a `typography` export map in `src/typography/tiers.ts`. Components use tiers instead of raw `text-sm` / `text-xl` / `tracking-*`.

**Reasoning:** Adjusting one tier recenters every matching screen; semantic names document intent (panel title vs metric vs UI).

**Rejected alternatives:** Ad hoc Tailwind classes only — duplicated tracking/size pairings and drift between games.

---

## 2026-05-10: Semantic color tokens (`semantic-*`)

**Decision:** Keep primitive CSS variables in `src/index.css`; define blends and alpha **only** in `src/themes/default.css` as `--semantic-*` tokens; expose them through Tailwind under the `semantic` color group. Components use those utilities (`bg-semantic-*`, `border-semantic-*`) and **do not** use palette utilities with `/opacity` modifiers.

**Reasoning:** One place controls opacity math; future per-game themes can swap stylesheet layers without chasing Tailwind classes across components.

**Rejected alternatives:** Encoding `primary/40`-style classes only in components — duplicates logic and blocks algorithmic or swappable themes later.

---

## 2026-05-10: Shared landing + roster footer patterns (WWW + Hat)

**Decision:** Use **`ResumeGameCard`** for in-progress saves (resume inside the card) and **`GameShell`** footer primary for **Start game** / **Start new game** (with discard confirm). **`TeamRosterSetupScreen`** renders scroll content only; **`teamRosterAdvanceLabel`** drives footer labels on roster steps. **`ReviewTeamsPanel`** plus per-game **Next steps** cards implement the review checkpoint.

**Reasoning:** Aligns both games’ pass-and-play rhythm and removes duplicate primaries inside roster panels.

**Rejected alternatives:** WWW-only full-screen resume gate; Hat-only inline roster footer primaries.
