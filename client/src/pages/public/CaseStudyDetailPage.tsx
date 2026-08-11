import { useParams, Link, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Quote } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/Skeleton';
import { Reveal } from '@/components/ui/Reveal';
import { caseStudiesApi } from '@/api/caseStudies.api';

export function CaseStudyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: caseStudy, isLoading, isError } = useQuery({
    queryKey: ['case-studies', 'public', slug],
    queryFn: () => caseStudiesApi.getPublicBySlug(slug as string),
    enabled: !!slug,
  });

  if (isError) return <Navigate to="/404" replace />;
  if (isLoading) {
    return (
      <Container className="py-20">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="mt-6 h-14 w-full max-w-xl" />
      </Container>
    );
  }
  if (!caseStudy) return null;

  const blocks = [
    { label: 'Problem', value: caseStudy.problem },
    { label: 'Strategy', value: caseStudy.strategy },
    { label: 'Solution', value: caseStudy.solution },
    { label: 'Implementation', value: caseStudy.implementation },
    { label: 'Results', value: caseStudy.results },
  ].filter((b) => b.value);

  return (
    <>
      <Helmet>
        <title>{caseStudy.title} — SpyDev</title>
      </Helmet>

      <Container className="py-16">
        <Link to="/case-studies" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> All case studies
        </Link>

        <Reveal className="mt-6">
          {caseStudy.client && <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground/70">{caseStudy.client}</p>}
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{caseStudy.title}</h1>
        </Reveal>

        {caseStudy.coverImage && (
          <Reveal className="mt-10 overflow-hidden rounded-3xl border border-border">
            <img src={caseStudy.coverImage} alt={caseStudy.title} className="w-full object-cover" />
          </Reveal>
        )}

        {caseStudy.metrics.length > 0 && (
          <Reveal className="mt-10 grid grid-cols-2 gap-6 rounded-3xl border border-border bg-surface p-8 sm:grid-cols-4">
            {caseStudy.metrics.map((m) => (
              <div key={m.label} className="text-center">
                <p className="font-display text-2xl font-semibold text-foreground">{m.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </Reveal>
        )}

        <div className="mt-14 space-y-10">
          {blocks.map((block) => (
            <Reveal key={block.label}>
              <h2 className="font-display text-xl font-semibold text-foreground">{block.label}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">{block.value}</p>
            </Reveal>
          ))}
        </div>

        {caseStudy.timeline.length > 0 && (
          <div className="mt-14">
            <h2 className="font-display text-xl font-semibold text-foreground">Timeline</h2>
            <div className="mt-6 space-y-4">
              {caseStudy.timeline.map((t) => (
                <div key={t.phase} className="rounded-2xl border border-border bg-surface p-5">
                  <h3 className="text-sm font-semibold text-foreground">{t.phase}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{t.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {caseStudy.testimonialQuote && (
          <Reveal className="mt-14 rounded-3xl border border-border bg-surface p-8">
            <Quote className="h-6 w-6 text-accent/50" />
            <p className="mt-4 text-lg leading-relaxed text-foreground/90">"{caseStudy.testimonialQuote}"</p>
            <p className="mt-4 text-sm font-medium text-foreground">
              {caseStudy.testimonialAuthor}
              {caseStudy.testimonialPosition && <span className="text-muted-foreground"> · {caseStudy.testimonialPosition}</span>}
            </p>
          </Reveal>
        )}

        {caseStudy.images.length > 0 && (
          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {caseStudy.images.map((src) => (
              <div key={src} className="overflow-hidden rounded-2xl border border-border">
                <img src={src} alt="" className="w-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
