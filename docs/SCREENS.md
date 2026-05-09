# Screen map — JDPassNPlay

Informal names for each player-facing screen so UX discussions and tickets can point at the same thing.  
Implementation hints refer to components under `src/features/` unless noted.

---

## Hub (`/`)

| Name | Description |
|------|-------------|
| **Game picker (home)** | Lists Who What Where, Hat Game, Imposter cards; entry to each game route. Component: `HomePage`. |

---

## Who What Where (`/games/whowhatwhere`)

Rendered inside **`GameShell`**. Flow is driven by `useGameController`: optional **`pendingMatch`**, then setup vs live **`match`**.

| Name | Description |
|------|-------------|
| **Saved match gate** | Shown when a mid-game match exists in storage: short copy plus **Resume game** / **Start new game**. Component: `ResumePrompt`. |
| **Game settings** | Team count, turn length, rounds, skips, word categories. Component: `SettingsScreen`. |
| **Team roster (per team)** | One step per team: name team and players (`teamStep` advances through teams). Component: `TeamSetupScreen`. |
| **Between turns (ready)** | Who’s up next, optional last-turn recap, scoreboard; handoff messaging and **Describer ready** → **Start turn** (same screen; footer depends on `readyHandoffRevealed`). Component: `ReadyScreen`. |
| **Active turn** | Current word, timer/metrics, Skip/Correct, skipped-word queue; **End turn** in header. Component: `ActiveTurnScreen`. |
| **Final match recap** | After the last turn of the match: last-turn card + scoreboard; **View final scores**. Component: `FinalSummaryScreen`. |
| **Final results** | Winner/tie, best turn, leaderboard; **Pick another game** / **Replay** / **New game**. Component: `ResultsScreen`. |

---

## Hat Game (`/games/hat`)

Rendered inside **`GameShell`**. Shell step is **`AppSnapshot.step`** (`hatGameAppTypes`). When step is **`game`**, **`HatGameSession.stage`** selects the in-play screen.

| Name | Description |
|------|-------------|
| **Landing** | Intro plus **Start game**, or **Resume** / **New game** if a save exists. |
| **Team count** | Choose number of teams only. |
| **Team roster (per team)** | Name team and players for the current team (`teamEditIndex`). Uses `TeamRosterSetupScreen` inside **`GamePanel`**. |
| **Review teams** | Read-only summary of all teams/players before clue entry. |
| **Clue entry — private handoff** | “Pass to …” / only that player should see the screen (`clueEntryRevealed === false`). |
| **Clue entry — figures form** | Enter famous figures for the active player (`clueEntryRevealed === true`). |
| **Loading saved game** | Brief placeholder while persisted state loads (`!controller.loaded`). |
| **Between turns (ready)** | Phase label, scoreboard, optional last-turn recap, handoff copy; **… ready** → **Start turn**. Session **`stage === "ready"`**. |
| **Active turn** | Current clue, timer and phase metrics, Skip/Correct, optional skipped-clue rows. Session **`stage === "turn"`**. |
| **Final results** | Tie or leaderboard, best-turn line; **Pick another game** / **Replay** / **New game**. Session **`stage === "results"`**. |

Screen assembly: **`buildHatGameScreen`** in `HatGameWebScreens.tsx`. **`HatGameApp`** adds shell chrome, error strip, and **`AppInfoOverlay`**.

---

## Imposter (`/games/imposter`)

| Name | Description |
|------|-------------|
| **Imposter placeholder** | Work-in-progress message and link back to the picker. Component: `ImposterPlaceholder`. |

---

## Overlays (not routes)

| Name | Description |
|------|-------------|
| **App info** | Small dialog: product name, version, credit. **`AppInfoOverlay`** — opened from the header **i** control on Hat Game and Who What Where. |

---

## Dev-only

| Name | Description |
|------|-------------|
| **UI gallery** | Side-by-side previews of Hat Game and Who What Where (`pnpm run ui-gallery`, `gallery.html`). Not part of the default production bundle. |

---

## Cross-game shorthand

These labels align across both games:

- **Settings** — global rules before play.
- **Team roster** — naming teams/players.
- **Ready / between turns** — pass-the-phone moment before a timed turn.
- **Active turn** — timed describing/guessing with Skip/Correct (WWW: header End turn; Hat: footer actions).
- **Results** — match outcome and replay/exit actions.

Who What Where adds **Saved match gate** and **Final match recap**. Hat Game adds **Landing**, **Team count**, **Review teams**, and **Clue entry** before the shared ready → turn → results loop.
