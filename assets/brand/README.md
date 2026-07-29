# Brand assets

Drop the real KÖFMAN logo exports here (see `/docs/phase1-kickoff.md` for exact
sizes). None were provided as inputs for this build, so the app currently
falls back to a text wordmark (`src/components/Logo.tsx`) wherever a logo
would go, so nothing is visually broken in the meantime.

Expected files once available:

- `icon-1024.png` — app icon, 1024×1024, no transparency (store icon).
- `icon-mark-512.png` — transparent PNG, ~512×512, in-app small marks.
- `logo-lockup-1200.png` — transparent PNG, ~1200px wide, login/splash screen.
- `logo-lockup-pdf-800.png` — transparent PNG, ~600–800px wide, PDF header.

Once dropped in, wire `logo-lockup-1200.png` into `src/screens/auth/LoginScreen.tsx`
and `App.tsx`'s splash config, and swap `assets/icon.png` / `assets/splash-icon.png`
for the real exports.
