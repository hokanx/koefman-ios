import { Zap, BatteryCharging, Sparkles, type LucideIcon } from 'lucide-react';
import { useInView } from '../hooks/useInView';

const FEATURES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Zap,
    title: 'Tri-motor drive',
    body: 'Three motors torque-vectoring every wheel, all silent.',
  },
  {
    icon: BatteryCharging,
    title: '800V architecture',
    body: '10 to 80 percent in the length of a coffee, cool the whole way.',
  },
  {
    icon: Sparkles,
    title: 'Clean-studio finish',
    body: 'An electric-blue sweep over glass-smooth black bodywork.',
  },
];

function Feature({ icon: Icon, title, body, delay }: { icon: LucideIcon; title: string; body: string; delay: number }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className="animate-blur-fade-up"
      style={inView ? { animationDelay: `${delay}ms` } : { animationPlayState: 'paused' }}
    >
      <div className="accent-glass mb-5 grid h-11 w-11 place-items-center rounded-full">
        <Icon size={20} className="text-[#3d7aff]" />
      </div>
      <h3 className="mb-2 text-xl font-semibold tracking-[-0.035em] md:text-2xl">{title}</h3>
      <p className="text-sm leading-relaxed text-white/55">{body}</p>
    </div>
  );
}

export function FeatureStrip() {
  return (
    <section className="border-t border-white/5 bg-black px-4 py-20 sm:px-6 md:px-12 md:py-28">
      <div className="grid gap-8 md:grid-cols-3 md:gap-12">
        {FEATURES.map((feature, i) => (
          <Feature key={feature.title} {...feature} delay={i * 120} />
        ))}
      </div>
    </section>
  );
}
