import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Service } from '@/types';
import { getIcon } from '@/utils/icons';
import { cn } from '@/utils/cn';

const ICON_TONES = [
  'bg-accent text-accent-foreground',
  'bg-secondary text-secondary-foreground',
  'bg-foreground text-background',
];

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = getIcon(service.icon);
  const number = String(index + 1).padStart(2, '0');
  const tone = ICON_TONES[index % ICON_TONES.length];

  return (
    <Link
      to={`/services/${service.slug}`}
      className={cn(
        'card-premium group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface p-7',
        'transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.35)]'
      )}
    >
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-accent/15 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-secondary/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />

      <div className="relative flex items-start justify-between">
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3',
            tone
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <span className="font-display text-sm font-medium text-muted-foreground/60">{number}</span>
      </div>

      <h3 className="relative mt-6 font-display text-xl font-semibold text-foreground">{service.title}</h3>
      <p className="relative mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">{service.shortDescription}</p>

      {service.technologies.length > 0 && (
        <div className="relative mt-5 flex flex-wrap gap-1.5">
          {service.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      <div className="relative mt-6 flex items-center gap-1.5 text-sm font-medium text-foreground">
        Learn more
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>
    </Link>
  );
}
