import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/types/entities';
import { cn } from '@/utils/cn';
import { CARD_TONES } from '@/utils/cardTones';
import { CATEGORY_LABELS, CATEGORY_TONE_INDEX } from '@/utils/projectCategories';
import { optimizedImageUrl } from '@/utils/cloudinary';

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
      <div className={cn('relative overflow-hidden bg-background', size === 'lg' ? 'aspect-[21/9]' : 'aspect-[16/11]')}>
        {project.coverImage ? (
          <img
            src={optimizedImageUrl(project.coverImage, 700)}
            alt={project.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface to-background">
            <span className="font-display text-2xl font-semibold text-muted-foreground/40">{project.name.charAt(0)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />
        <span className="absolute left-3 top-3 rounded-full bg-[var(--tone-bg)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--tone-text)] shadow-sm">
          {CATEGORY_LABELS[project.category]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {project.client && <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">{project.client}</p>}
        <h3 className="mt-1 font-display text-base font-semibold tracking-tight text-foreground">{project.name}</h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">{project.description}</p>

        <div className="mt-3 flex items-center gap-3 border-t border-border pt-3">
          <span className="text-xs font-semibold text-foreground">View project</span>
          <span className="ml-auto flex h-7 w-7 items-center justify-center rounded-full border border-border text-foreground transition-all duration-300 group-hover:border-[var(--tone-bg)] group-hover:bg-[var(--tone-bg)] group-hover:text-[var(--tone-text)]">
            <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
