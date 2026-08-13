import { useState, type CSSProperties, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Code2, Smartphone, Bot, ShieldCheck, ShoppingBag, Layers, Compass } from 'lucide-react';
import { projectsApi } from '@/api/projects.api';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { buttonVariants } from '@/components/ui/Button';
import { CARD_TONES } from '@/utils/cardTones';
import { CATEGORY_LABELS, CATEGORY_TONE_INDEX } from '@/utils/projectCategories';
import type { HomepageSection } from '@/types';
import type { Project } from '@/types/entities';

const CATEGORY_ICONS: Record<Project['category'], typeof Code2> = {
  web: Code2,
  mobile: Smartphone,
  ai: Bot,
  saas: Layers,
  cybersecurity: ShieldCheck,
  ecommerce: ShoppingBag,
};

/** Cover image shown in full (object-contain, never cropped) on a soft
 * tone-tinted backdrop that fills any letterboxing — and the fallback for
 * projects with no image (or a broken URL) uses the same backdrop plus a
 * category icon, so it reads as intentional either way. */
function ProjectImage({ project }: { project: Project }) {
  const [broken, setBroken] = useState(false);
  const tone = CARD_TONES[CATEGORY_TONE_INDEX[project.category]];
  const Icon = CATEGORY_ICONS[project.category];
  const backdrop = { background: `color-mix(in srgb, ${tone.bg} 10%, var(--surface))` };

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden" style={backdrop}>
      {project.coverImage && !broken ? (
        <img
          src={project.coverImage}
          alt={project.name}
          onError={() => setBroken(true)}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <Icon className="h-14 w-14 opacity-25" style={{ color: tone.bg }} strokeWidth={1.5} />
      )}
    </div>
  );
}

/** Standard project card — full image on top (never cropped), details below. */
function ProjectTile({
  project,
  span,
  delay,
  aspect,
  large,
}: {
  project: Project;
  span: string;
  delay: number;
  aspect: string;
  large?: boolean;
}) {
  const tone = CARD_TONES[CATEGORY_TONE_INDEX[project.category]];
  const toneVars = { '--tone-bg': tone.bg, '--tone-text': tone.text } as CSSProperties;
  return (
    <Reveal
      delay={delay}
      style={toneVars}
      className={`card-premium group relative overflow-hidden rounded-3xl border border-border bg-surface ${span}`}
    >
      <Link to={`/projects/${project.slug}`} className="flex h-full flex-col">
        <div className={`relative overflow-hidden bg-background ${aspect}`}>
          <ProjectImage project={project} />
          <span
            className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm"
            style={{ backgroundColor: tone.bg, color: tone.text }}
          >
            {CATEGORY_LABELS[project.category]}
          </span>
        </div>
        <div className={`flex flex-1 flex-col ${large ? 'p-6' : 'p-5'}`}>
          {project.client && <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">{project.client}</p>}
          <h3 className={`mt-1.5 font-display font-semibold tracking-tight text-foreground ${large ? 'text-lg' : 'text-base'}`}>
            {project.name}
          </h3>
          {large && (
            <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
          )}
          <div
            className={`flex items-center gap-3 border-t border-border ${large ? 'mt-4 pt-4' : 'mt-3 pt-3'}`}
          >
            <span className={`font-semibold text-foreground ${large ? 'text-sm' : 'text-xs'}`}>View project</span>
            <span
              className={`ml-auto flex shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-all duration-300 group-hover:border-[var(--tone-bg)] group-hover:bg-[var(--tone-bg)] group-hover:text-[var(--tone-text)] ${large ? 'h-8 w-8' : 'h-7 w-7'}`}
            >
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

function ViewAllTile({ span, delay }: { span: string; delay: number }) {
  return (
    <Reveal
      delay={delay}
      className={`relative flex min-h-[16rem] flex-col items-center justify-center overflow-hidden rounded-3xl border border-border bg-surface p-8 text-center ${span}`}
    >
      <Compass className="pointer-events-none absolute -bottom-6 -right-6 h-32 w-32 text-foreground/[0.04]" strokeWidth={1} aria-hidden />
      <p className="relative font-display text-lg font-semibold text-foreground">See all our work</p>
      <p className="relative mt-1.5 text-sm text-muted-foreground">Browse the full project archive</p>
      <Link to="/projects" className={buttonVariants({ size: 'md', className: 'relative mt-5' })}>
        View all projects
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Reveal>
  );
}

export function ProjectsSection({ section }: { section: HomepageSection }) {
  const { data } = useQuery({
    queryKey: ['projects', 'public', 'homepage-bento'],
    queryFn: () => projectsApi.listPublic({ limit: 5 }),
  });
  const projects = data?.data ?? [];
  if (projects.length === 0) return null;

  // Row 1: two even, generous cards side by side — plenty of room for a
  // full screenshot at almost any aspect ratio without cropping.
  // Row 2: up to three smaller cards (or a "view all" tile filling the gap).
  const tiles: ReactNode[] = [];
  if (projects[0]) tiles.push(<ProjectTile key={projects[0]._id} project={projects[0]} span="sm:col-span-2 lg:col-span-6" aspect="aspect-[16/10]" large delay={0} />);
  if (projects[1]) tiles.push(<ProjectTile key={projects[1]._id} project={projects[1]} span="sm:col-span-2 lg:col-span-6" aspect="aspect-[16/10]" large delay={0.05} />);

  const rest = projects.slice(2, 5);
  rest.forEach((project, i) => {
    tiles.push(<ProjectTile key={project._id} project={project} span="sm:col-span-1 lg:col-span-4" aspect="aspect-[4/3]" delay={0.1 + i * 0.05} />);
  });
  if (rest.length < 3) {
    const remaining = 3 - rest.length;
    const spanMap = ['lg:col-span-4', 'lg:col-span-8', 'lg:col-span-12'];
    tiles.push(<ViewAllTile key="view-all" span={`sm:col-span-2 ${spanMap[remaining - 1]}`} delay={0.25} />);
  }

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="text-sm font-medium text-accent">Selected work</span>
            <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {section.heading || 'Recent projects'}
            </h2>
          </div>
          <Link to="/projects" className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-foreground hover:text-secondary sm:flex">
            View all projects
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12">{tiles}</div>

        <Link
          to="/projects"
          className="mt-8 flex items-center justify-center gap-1.5 rounded-full py-3 text-sm font-medium text-foreground hover:text-secondary sm:hidden"
        >
          View all projects
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Container>
    </section>
  );
}
