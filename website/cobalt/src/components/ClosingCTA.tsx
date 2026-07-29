import { ArrowRight } from 'lucide-react';
import { useInView } from '../hooks/useInView';

export function ClosingCTA() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section className="relative overflow-hidden bg-black py-28 md:py-40">
      <div className="floor-glow" />
      <div ref={ref} className="relative flex flex-col items-center px-4 text-center">
        <h2
          className="animate-blur-fade-up mb-4 text-4xl font-bold tracking-[-0.035em] sm:text-6xl"
          style={inView ? { animationDelay: '0ms' } : { animationPlayState: 'paused' }}
        >
          Configure COBALT.
        </h2>
        <p
          className="animate-blur-fade-up font-mono mb-10 text-sm tracking-[0.2em] text-white/55"
          style={inView ? { animationDelay: '120ms' } : { animationPlayState: 'paused' }}
        >
          120 UNITS · BUILD SLOTS OPEN
        </p>
        <a
          href="#"
          className="animate-blur-fade-up flex items-center gap-2 rounded-full bg-[#3d7aff] px-8 py-3 font-medium text-white transition-colors hover:bg-[#5f94ff]"
          style={inView ? { animationDelay: '240ms' } : { animationPlayState: 'paused' }}
        >
          Start your build
          <ArrowRight size={18} />
        </a>
      </div>
    </section>
  );
}
