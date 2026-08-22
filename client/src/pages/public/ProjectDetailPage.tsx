import { useParams, Link, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowUpRight, Code2 } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/Skeleton';
import { Reveal } from '@/components/ui/Reveal';
import { buttonVariants } from '@/components/ui/Button';
import { projectsApi } from '@/api/projects.api';
import { optimizedImageUrl } from '@/utils/cloudinary';

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading, isError } = useQuery({
    queryKey: ['projects', 'public', slug],
    queryFn: () => projectsApi.getPublicBySlug(slug as string),
    enabled: !!slug,
  });

  if (isError) return <Navigate to="/404" replace />;

  if (isLoading) {
    return (
      <Container className="py-20">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="mt-6 h-14 w-full max-w-xl" />
        <Skeleton className="mt-10 h-96 w-full rounded-3xl" />
      </Container>
    );
  }
  if (!project) return null;

  return (
    <>
      <Helmet>
        <title>{project.seo?.title || `${project.name} — SpyDev`}</title>
        <meta name="description" content={project.seo?.description || project.description} />
      </Helmet>

      <Container className="py-16">
        <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> All projects
        </Link>

        <Reveal className="mt-6">
          {project.client && <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground/70">{project.client}</p>}
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{project.name}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{project.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {project.projectUrl && (
              <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className={buttonVariants({ size: 'sm' })}>
                Visit live site
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: 'secondary', size: 'sm' })}
              >
                <Code2 className="h-3.5 w-3.5" />
                View code
              </a>
            )}
          </div>
        </Reveal>

        {project.coverImage && (
          <Reveal className="mt-10 overflow-hidden rounded-3xl border border-border">
            <img src={optimizedImageUrl(project.coverImage, 1400)} alt={project.name} loading="lazy" className="w-full object-cover" />
          </Reveal>
        )}

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {[
            { label: 'Challenge', value: project.challenge },
            { label: 'Solution', value: project.solution },
            { label: 'Results', value: project.results },
          ]
            .filter((b) => b.value)
            .map((block) => (
              <Reveal key={block.label} className="rounded-3xl border border-border bg-surface p-6">
                <h3 className="text-sm font-semibold text-accent">{block.label}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{block.value}</p>
              </Reveal>
            ))}
        </div>

        {project.screenshots.length > 0 && (
          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {project.screenshots.map((src) => (
              <div key={src} className="overflow-hidden rounded-2xl border border-border">
                <img src={optimizedImageUrl(src, 900)} alt="" loading="lazy" className="w-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {project.technologies.length > 0 && (
          <div className="mt-14 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span key={tech} className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-muted-foreground">
                {tech}
              </span>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
