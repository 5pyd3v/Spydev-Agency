import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { pagesApi } from '@/api/entities.api';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { Skeleton } from '@/components/ui/Skeleton';
import { buttonVariants } from '@/components/ui/Button';
import { useCountUp } from '@/hooks/useCountUp';
import { usePublicHomepageSections } from '@/hooks/queries/useHomepageSections';

function Stat({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  const { ref, value: v } = useCountUp(value);
  return (
    <div className="text-center">
      <p className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
        <span ref={ref}>{v}</span>
        {suffix}
      </p>
      <p className="mt-1.5 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export function AboutPage() {
  const { data: page, isLoading } = useQuery({ queryKey: ['pages', 'about'], queryFn: () => pagesApi.getPublic('about') });
  const { data: sections } = usePublicHomepageSections();
  const statsSection = sections?.find((s) => s.type === 'stats');
  const statsItems = (statsSection?.content.items as { label: string; value: number; suffix?: string }[] | undefined) ?? [];

  return (
    <>
      <Helmet>
        <title>{page?.seo?.title || 'About — SpyDev'}</title>
        <meta name="description" content={page?.seo?.description || 'Learn about SpyDev — our mission, values, and approach to building technology.'} />
      </Helmet>

      <Container className="py-20">
        <Reveal>
          <span className="text-sm font-medium text-accent">About SpyDev</span>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {page?.title || 'A technology agency built for serious work.'}
          </h1>
        </Reveal>

        {isLoading ? (
          <div className="mt-10 space-y-3">
            <Skeleton className="h-4 w-full max-w-2xl" />
            <Skeleton className="h-4 w-full max-w-xl" />
            <Skeleton className="h-4 w-full max-w-lg" />
          </div>
        ) : (
          page?.content && (
            <Reveal
              className="prose prose-neutral dark:prose-invert mt-10 max-w-3xl text-muted-foreground [&_a]:text-accent [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-foreground [&_p]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          )
        )}

        {statsItems.length > 0 && (
          <Reveal className="mt-16 grid grid-cols-2 gap-8 rounded-3xl border border-border bg-surface px-8 py-10 sm:grid-cols-4">
            {statsItems.map((item) => (
              <Stat key={item.label} {...item} />
            ))}
          </Reveal>
        )}

        <Reveal className="mt-16 flex flex-col items-start justify-between gap-6 rounded-3xl border border-border bg-surface p-8 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground">Meet the team</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">The engineers and specialists behind SpyDev.</p>
          </div>
          <Link to="/team" className={buttonVariants({ variant: 'secondary', size: 'sm' })}>
            View team
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Reveal>
      </Container>
    </>
  );
}
