import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Service } from '@/types';
import { getIcon } from '@/utils/icons';
import { cn } from '@/utils/cn';

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = getIcon(service.icon);
  const number = String(index + 1).padStart(2, '0');

  return (
    <Link
      to={`/services/${service.slug}`}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface p-7',
        'transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-glow'
      )}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />

      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background text-accent transition-colors group-hover:border-accent/40">
          <Icon className="h-5 w-5" />
        </div>
        <span className="font-display text-sm font-medium text-muted-foreground/70">{number}</span>
      </div>

      <h3 className="mt-6 font-display text-xl font-semibold text-foreground">{service.title}</h3>
      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">{service.shortDescription}</p>

      {service.technologies.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-1.5">
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

      <div className="mt-6 flex items-center gap-1.5 text-sm font-medium text-foreground">
        Learn more
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>
    </Link>
  );
}
