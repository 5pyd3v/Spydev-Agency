import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Service } from '@/types';
import { getIcon } from '@/utils/icons';
import { cn } from '@/utils/cn';

const TONES = [
  {
    icon: 'bg-accent text-accent-foreground shadow-[0_12px_32px_-8px_var(--accent)]',
    glow: 'bg-accent',
    bar: 'bg-accent',
    cta: 'group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground',
  },
  {
    icon: 'bg-secondary text-secondary-foreground shadow-[0_12px_32px_-8px_var(--secondary)]',
    glow: 'bg-secondary',
    bar: 'bg-secondary',
    cta: 'group-hover:border-secondary group-hover:bg-secondary group-hover:text-secondary-foreground',
  },
  {
    icon: 'bg-accent-alt text-white shadow-[0_12px_32px_-8px_var(--accent-alt)]',
    glow: 'bg-accent-alt',
    bar: 'bg-accent-alt',
    cta: 'group-hover:border-accent-alt group-hover:bg-accent-alt group-hover:text-white',
  },
  {
    icon: 'bg-foreground text-background shadow-[0_12px_32px_-8px_rgba(0,0,0,0.35)]',
    glow: 'bg-foreground',
    bar: 'bg-foreground',
    cta: 'group-hover:border-foreground group-hover:bg-foreground group-hover:text-background',
  },
];

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = getIcon(service.icon);
  const number = String(index + 1).padStart(2, '0');
  const tone = TONES[index % TONES.length];

  return (
    <Link
      to={`/services/${service.slug}`}
      className="card-premium group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_-20px_rgba(0,0,0,0.35)]"
    >
      {/* Always-on top accent bar — the card's color identity, not just a hover flourish. */}
      <div className={cn('absolute inset-x-0 top-0 h-[3px] opacity-80', tone.bar)} aria-hidden />

      {/* Ambient tone wash, faintly visible at rest and blooming on hover. */}
      <div
        className={cn(
          'pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-[0.06] blur-3xl transition-opacity duration-500 group-hover:opacity-25',
          tone.glow
        )}
        aria-hidden
      />

      {/* Faint ghost number watermark — the premium-agency "big index" motif, kept subtle. */}
      <span
        className="pointer-events-none absolute -right-1 -top-3 select-none font-display text-5xl font-bold leading-none text-foreground/[0.04] transition-colors duration-300 group-hover:text-foreground/[0.07]"
        aria-hidden
      >
        {number}
      </span>

      <div className="relative flex items-start justify-between">
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3',
            tone.icon
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <h3 className="relative mt-6 font-display text-lg font-semibold tracking-tight text-foreground">{service.title}</h3>
      <p className="relative mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">{service.shortDescription}</p>

      {service.technologies.length > 0 && (
        <div className="relative mt-4 flex flex-wrap gap-1.5">
          {service.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      <div className="relative mt-5 flex items-center gap-3 border-t border-border pt-5">
        <span className="text-sm font-semibold text-foreground">Learn more</span>
        <span
          className={cn(
            'ml-auto flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition-all duration-300',
            tone.cta
          )}
        >
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
