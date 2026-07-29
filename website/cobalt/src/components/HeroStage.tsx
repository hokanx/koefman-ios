import { useRef } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { Navbar } from './Navbar';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { useVideoScrub } from '../hooks/useVideoScrub';
import { useReducedMotion } from '../hooks/useReducedMotion';

const VIDEO_URL = 'https://zxdefgavgwfxastwmmjm.supabase.co/storage/v1/object/public/assets/cobalt.mp4';

const BEATS = ['Powered down.', 'The blue sweeps across it.', 'Fully charged.'];

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function HeroCopy() {
  return (
    <div className="relative z-10 flex flex-1 flex-col justify-end px-4 pb-10 sm:px-6 md:px-12 md:pb-20">
      <div
        className="animate-blur-fade-up font-mono mb-6 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-white/55 sm:gap-6 sm:text-xs"
        style={{ animationDelay: '250ms' }}
      >
        <span>COBALT-01</span>
        <span>·</span>
        <span>TRI-MOTOR ELECTRIC</span>
        <span>·</span>
        <span>LIMITED / 120 UNITS</span>
      </div>

      <h1
        className="animate-blur-fade-up mb-4 text-5xl font-bold leading-[0.92] tracking-[-0.035em] sm:text-7xl md:mb-6 md:text-8xl"
        style={{ animationDelay: '400ms' }}
      >
        <span className="accent-text">Charged.</span>
      </h1>

      <p
        className="animate-blur-fade-up mb-8 max-w-xl text-base text-white/55 sm:text-lg md:mb-12 md:text-xl"
        style={{ animationDelay: '520ms' }}
      >
        Electric-blue over black — clean, silent, and always ready.
      </p>

      <div className="flex flex-wrap gap-3 sm:gap-4">
        <a
          href="#"
          className="animate-cta-primary flex items-center gap-2 rounded-full bg-[#3d7aff] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#5f94ff] sm:px-8 sm:py-3"
        >
          Configure yours
          <ArrowRight size={18} />
        </a>
        <a
          href="#"
          className="animate-blur-fade-up liquid-glass flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium sm:px-8 sm:py-3"
          style={{ animationDelay: '740ms' }}
        >
          <Play size={18} />
          Watch the reveal
        </a>
      </div>
    </div>
  );
}

function RevealCaptions({ progress }: { progress: number }) {
  const captionsOpacity = clamp01((progress - 0.15) / 0.1);

  let beatIndex = -1;
  if (progress >= 0.85) beatIndex = 2;
  else if (progress >= 0.55) beatIndex = 1;
  else if (progress >= 0.25) beatIndex = 0;

  const percent = Math.round(progress * 100);

  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center" style={{ opacity: captionsOpacity }}>
        <p className="font-mono mb-4 text-xs uppercase tracking-[0.24em] text-[#3d7aff]">THE REVEAL</p>
        {BEATS.map((text, i) => (
          <h2
            key={text}
            className="absolute text-3xl font-semibold text-white/90 transition-opacity duration-500 sm:text-5xl"
            style={{ opacity: beatIndex === i ? 1 : 0 }}
          >
            {text}
          </h2>
        ))}
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-10 z-10 flex flex-col items-center gap-3 px-4"
        style={{ opacity: captionsOpacity }}
      >
        <div className="h-px w-full max-w-xs bg-white/10">
          <div className="h-full bg-[#3d7aff]" style={{ width: `${percent}%` }} />
        </div>
        <p className="font-mono text-[11px] tracking-[0.2em] text-white/45">
          CHARGE {percent}% &rarr; 100%
        </p>
      </div>
    </>
  );
}

export function HeroStage() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reducedMotion = useReducedMotion();
  const progress = useScrollProgress(sectionRef);
  useVideoScrub(videoRef, reducedMotion ? 0 : progress);

  if (reducedMotion) {
    return (
      <section ref={sectionRef as never} className="relative flex min-h-screen flex-col bg-black">
        <Navbar />
        <div className="relative w-full">
          <video
            ref={videoRef}
            className="w-full"
            src={VIDEO_URL}
            controls
            playsInline
            preload="metadata"
          />
        </div>
        <div className="relative">
          <HeroCopy />
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef as never} className="relative h-[300vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={VIDEO_URL}
          muted
          playsInline
          preload="auto"
        />

        <Navbar />

        <div className="absolute inset-0 flex flex-col" style={{ opacity: 1 - clamp01(progress / 0.15) }}>
          <HeroCopy />
        </div>

        <RevealCaptions progress={progress} />
      </div>
    </section>
  );
}
