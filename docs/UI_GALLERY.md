# UI gallery (development only)

Side-by-side **Hat Game** and **Who What Where** screens using preset fake data so you can skim flows without replaying games.

## Run locally

```bash
pnpm run ui-gallery
```

Opens the dev server on port **5174** with **`/gallery.html`** (see `vite.ui-gallery.config.ts`). The production app (`pnpm run dev` / `pnpm run build`) is unchanged and does not ship this bundle.

## Contents

- Ten paired slides (toolbar **Back / Next / dropdown**): landing vs settings, setup steps, ready/active/recap/results.
- **Imposter** has only a placeholder route in the app — there are no distinct Imposter screens to mirror yet.

## Implementation notes

- Source lives under `src/ui-gallery/`.
- Hat previews reuse `buildHatGameScreen` with a lightweight mock controller (`hatGalleryController.ts`).
- Who What Where previews reuse real screen components (`SettingsScreen`, `TeamSetupScreen`, `ReadyScreen`, etc.) backed by `src/ui-gallery/wwwGallerySessions.ts`.
- Previews use `pointer-events-none` so taps do nothing.
