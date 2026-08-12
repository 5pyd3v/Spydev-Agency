import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/types/entities';
import { cn } from '@/utils/cn';
import { CARD_TONES } from '@/utils/cardTones';

const CATEGORY_LABELS: Record<Project['category'], string> = {
  web: 'Web',
  mobile: 'Mobile',
  ai: 'AI',
  saas: 'SaaS',
  cybersecurity: 'Cybersecurity',
  ecommerce: 'E-commerce',
};

// Fixed decorative palette per category — not tied to admin brand colors,
// so categories stay visually distinct no matter what's set in Appearance.
const CATEGORY_TONE_INDEX: Record<Project['category'], number> = {
  mobile: 0, // red
  cybersecurity: 1, // black
  ecommerce: 2, // yellow
  ai: 3, // orange
  web: 4, // gray
  saas: 4, // gray
};

export function ProjectCard({ project, size = 'md' }: { project: Project; size?: 'md' | 'lg' }) {
  const tone = CARD_TONES[CATEGORY_TONE_INDEX[project.category]];
  const toneVars = { '--tone-bg': tone.bg, '--tone-text': tone.text, '--tone-shadow': tone.shadow } as CSSProperties;

  return (
    <Link
      to={`/projects/${project.slug}`}
      style={toneVars}
      className={cn(
        'card-premium group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_-20px_var(--tone-shadow)]',
        size === 'lg' && 'sm:col-span-2'
      )}
    >
      <div className={cn('relative overflow-hidden bg-background', size === 'lg' ? 'aspect-[16/9]' : 'aspect-[4/3]')}>
        {project.coverImage ? (
          <img
            src={project.coverImage}
            alt={project.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface to-background">
            <span className="font-display text-2xl font-semibold text-muted-foreground/40">{project.name.charAt(0)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />
        <span className="absolute left-4 top-4 rounded-full bg-[var(--tone-bg)] px-3 py-1 text-xs font-semibold text-[var(--tone-text)] shadow-sm">
          {CATEGORY_LABELS[project.category]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        {project.client && <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">{project.client}</p>}
        <h3 className="mt-1.5 font-display text-lg font-semibold tracking-tight text-foreground">{project.name}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">{project.description}</p>

        <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
          <span className="text-sm font-semibold text-foreground">View project</span>
          <span className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition-all duration-300 group-hover:border-[var(--tone-bg)] group-hover:bg-[var(--tone-bg)] group-hover:text-[var(--tone-text)]">
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
