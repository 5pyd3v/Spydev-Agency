import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { projectsApi } from '@/api/projects.api';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { ProjectCard } from '@/components/projects/ProjectCard';
import type { HomepageSection } from '@/types';

export function ProjectsSection({ section }: { section: HomepageSection }) {
  const { data } = useQuery({
    queryKey: ['projects', 'public', 'homepage'],
    queryFn: () => projectsApi.listPublic({ limit: 4 }),
  });
  const projects = data?.data ?? [];
  if (projects.length === 0) return null;

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
          <Link to="/projects" className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-foreground hover:text-accent sm:flex">
            View all projects
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard key={project._id} project={project} size={i === 0 ? 'lg' : 'md'} />
          ))}
        </div>

        <Link
          to="/projects"
          className="mt-8 flex items-center justify-center gap-1.5 rounded-full py-3 text-sm font-medium text-foreground hover:text-accent sm:hidden"
        >
          View all projects
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Container>
    </section>
  );
}
