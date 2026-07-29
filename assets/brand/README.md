# Brand assets

Real exports, uploaded by the user via GitHub — all white artwork on a
transparent background except the store icon (per Apple's no-transparency
requirement), so they read correctly against the app's dark theme.

- `app_icon_1024.png` — 1024×1024, opaque black background. Wired as the app
  icon (`assets/icon.png`).
- `icon_mark_transparent_1024.png` / `icon_mark_transparent_512.png` — icon-only
  mark, transparent. `icon_mark_transparent_512.png` is wired into
  `src/components/Logo.tsx` (`size="small"`) for small in-app marks.
- `lockup_transparent_1200.png` — full "KÖFMAN" lockup, transparent, 1200×783.
  Wired into `Logo.tsx` (`size="large"`, used on login/signup/splash) and as
  the native splash image (`assets/splash-icon.png`) against the theme's dark
  background color.
- `lockup_pdf_800.png` — full lockup, transparent, 800×522, reserved for the
  Phase 6 PDF header template. Note: it's white artwork, same as the others —
  the PDF header design will need a dark band/backdrop behind it (or a
  separate dark-on-white export) since print PDFs are typically white paper.
