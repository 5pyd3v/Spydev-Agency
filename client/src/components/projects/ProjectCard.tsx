import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/types/entities';
import { cn } from '@/utils/cn';

const CATEGORY_LABELS: Record<Project['category'], string> = {
  web: 'Web',
  mobile: 'Mobile',
  ai: 'AI',
  saas: 'SaaS',
  cybersecurity: 'Cybersecurity',
  ecommerce: 'E-commerce',
};

export function ProjectCard({ project, size = 'md' }: { project: Project; size?: 'md' | 'lg' }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className={cn(
        'card-premium group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.35)]',
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          {CATEGORY_LABELS[project.category]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        {project.client && <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground/70">{project.client}</p>}
        <h3 className="mt-1.5 font-display text-xl font-semibold text-foreground">{project.name}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
        <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-foreground">
          View project
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
      </div>
    </Link>
  );
}
