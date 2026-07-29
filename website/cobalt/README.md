# COBALT

A clean-studio electric hypercar product showcase. React + Tailwind CSS + Lucide icons, with a scroll-scrubbed video hero: the page opens directly on the sticky scrub stage, and scroll position alone drives `video.currentTime` — no autoplay, no loop.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Notes

- Single `<video>` element, scrubbed via a rAF-throttled scroll listener (`src/hooks/useVideoScrub.ts`, `src/hooks/useScrollProgress.ts`).
- Respects `prefers-reduced-motion`: the scrub stage falls back to a normal `<video controls>` element (still no autoplay) and all entrance animations become simple opacity fades.
- The hero video source is `https://zxdefgavgwfxastwmmjm.supabase.co/storage/v1/object/public/assets/cobalt.mp4` — swap it in `src/components/HeroStage.tsx` (`VIDEO_URL`) if the asset moves.
