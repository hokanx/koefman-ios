# Start Here — KÖFMAN Native Rebuild, Phase 1

## Before you open Claude Code (5 setup steps)

1. **New repo.** Create a fresh, private GitHub repo (e.g. `koefman-ios`). Do NOT
   reuse the old `koefman` repo — that's the broken web app.
2. **New Supabase project.** Create a clean project. In the SQL editor, run
   `schema.sql`. Then create two **private** Storage buckets: `logos`,
   `signatures`.
3. **Env.** Copy the new project's URL + anon key into a **git-ignored** `.env`
   (add `.env` to `.gitignore` first). Never commit it.
4. **Logo assets.** Add the logo to an `assets/brand/` folder:
   - icon-only version → app icon + small in-app marks
   - full "KÖFMAN" lockup → login/splash screen + PDF header
   (Ideally export transparent-background PNGs at the sizes below.)
5. **Docs in repo.** Drop `SPEC.md` and `schema.sql` into a `/docs` folder so
   Claude Code can read them directly.

## What goes into Claude Code

- **Build inputs:** `SPEC.md` + `schema.sql` + the kickoff prompt below.
- **Design (later):** feed Claude Design's tokens + screen designs in as Claude
  Code reaches each screen — not all at once now.

---

## Paste this into Claude Code to start Phase 1

> You're building KÖFMAN Simple Office — a native iOS app. Read `/docs/SPEC.md`
> and `/docs/schema.sql` fully before doing anything; they are the source of
> truth for scope and data model. Ask me any blocking questions before writing
> code.
>
> Stack: **Expo (React Native) + TypeScript**, Supabase backend (project already
> created, schema already applied — do not recreate tables), `@tanstack/
> react-query`, `react-hook-form` + `zod`, and an i18n setup supporting German
> (default), Arabic (RTL), and English.
>
> **Phase 1 scope only — the foundation. Do NOT build feature screens yet:**
> 1. Initialize the Expo app (TypeScript) with a clean folder structure.
> 2. Install and configure the Supabase client; read URL + anon key from `.env`
>    (already git-ignored). Add a typed data layer.
> 3. Auth: email/password via Supabase — sign up, sign in, sign out, persisted
>    session, protected routes, and an unauthenticated → login redirect.
> 4. i18n scaffold with DE/EN/AR locale files and a language switch that
>    persists; enable and verify **RTL** for Arabic (I18nManager + mirrored
>    layout).
> 5. Navigation shell: bottom tabs for Dashboard, Customers, Offers, Invoices,
>    Settings — as empty placeholder screens for now.
> 6. Theme: dark-premium default; wire brand primary/accent as theme values so
>    Claude Design's tokens can drop in later. Place the KÖFMAN logo on the
>    login/splash screen from `assets/brand/`.
>
> Work in this order, and **stop after each step so I can run it on device and
> confirm** before you continue. Keep secrets out of the repo. When Phase 1 is
> approved, we'll do Phase 2 (Customers) against the schema.

---

## Logo export sizes (handy reference)

- **App icon:** 1024×1024 PNG (no transparency for the store icon; Expo
  generates the rest).
- **In-app icon mark:** transparent PNG, ~512×512 (scales down cleanly).
- **Login/splash lockup:** transparent PNG, ~1200px wide.
- **PDF header lockup:** transparent PNG, ~600–800px wide (crisp at print DPI).

---

## The order of play

Claude Code builds Phase 1 (this doc). In parallel, Claude Design produces tokens
+ the offer editor + PDF templates first. As Claude Code moves Phase 2→7 (
Customers → Offers → Signatures → Invoices → PDF → Dashboard/Settings), you feed
in each finished design. They meet at every screen.
