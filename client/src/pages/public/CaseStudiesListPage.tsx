import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { Skeleton } from '@/components/ui/Skeleton';
import { caseStudiesApi } from '@/api/caseStudies.api';

export function CaseStudiesListPage() {
  const { data: caseStudies, isLoading } = useQuery({
    queryKey: ['case-studies', 'public'],
    queryFn: () => caseStudiesApi.listPublic(),
  });

  return (
    <>
      <Helmet>
        <title>Case Studies — SpyDev</title>
        <meta name="description" content="In-depth case studies covering how SpyDev approaches complex technology problems." />
      </Helmet>

      <Container className="py-20">
        <Reveal>
          <span className="text-sm font-medium text-accent">Case studies</span>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            How we solve hard problems.
          </h1>
        </Reveal>

        <div className="mt-14 space-y-5">
          {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-3xl" />)}

          {!isLoading && caseStudies?.length === 0 && (
            <p className="text-sm text-muted-foreground">No case studies published yet.</p>
          )}

          {caseStudies?.map((cs) => (
            <Reveal key={cs._id}>
              <Link
                to={`/case-studies/${cs.slug}`}
                className="group flex flex-col justify-between gap-6 rounded-3xl border border-border bg-surface p-8 transition-all hover:-translate-y-0.5 hover:border-accent/40 sm:flex-row sm:items-center"
              >
                <div>
                  {cs.client && <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground/70">{cs.client}</p>}
                  <h2 className="mt-1.5 font-display text-2xl font-semibold text-foreground">{cs.title}</h2>
                  {cs.results && <p className="mt-2 max-w-xl text-sm text-muted-foreground line-clamp-2">{cs.results}</p>}
                </div>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent" />
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </>
  );
}
