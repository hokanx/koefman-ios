import { useInView } from '../hooks/useInView';

const PLATES = [
  { label: '0–100 KM/H', figure: '2.1', unit: 'seconds, tri-motor' },
  { label: 'TOP SPEED', figure: '330', unit: 'km/h, limited' },
  { label: 'POWER', figure: '1,340', unit: 'hp, instant torque' },
  { label: 'WEIGHT', figure: '1,890', unit: 'kg with pack' },
];

function Plate({ label, figure, unit, delay }: { label: string; figure: string; unit: string; delay: number }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className="liquid-glass animate-rise-in rounded-2xl p-6 md:p-8"
      style={inView ? { animationDelay: `${delay}ms` } : { animationPlayState: 'paused' }}
    >
      <p className="font-mono mb-4 text-[11px] uppercase tracking-[0.2em] text-white/45">{label}</p>
      <p className="accent-text font-mono mb-2 text-5xl md:text-6xl">{figure}</p>
      <div
        className="mb-3 h-px w-full bg-[#3d7aff]/60 animate-line-grow"
        style={inView ? { animationDelay: `${delay}ms` } : { animationPlayState: 'paused' }}
      />
      <p className="text-sm text-white/50">{unit}</p>
    </div>
  );
}

export function SpecPlates() {
  return (
    <section className="bg-black px-4 py-24 sm:px-6 md:px-12 md:py-36">
      <p className="font-mono mb-4 text-xs uppercase tracking-[0.24em] text-[#3d7aff]">PERFORMANCE</p>
      <h2 className="mb-12 text-3xl font-semibold tracking-[-0.035em] sm:text-5xl md:mb-16">Charged and quiet.</h2>
      <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
        {PLATES.map((plate, i) => (
          <Plate key={plate.label} {...plate} delay={i * 120} />
        ))}
      </div>
    </section>
  );
}
