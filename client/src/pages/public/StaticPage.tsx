import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/Skeleton';
import { Reveal } from '@/components/ui/Reveal';
import { pagesApi } from '@/api/entities.api';

export function StaticPage({ slug, fallbackTitle }: { slug: string; fallbackTitle: string }) {
  const { data: page, isLoading, isError } = useQuery({
    queryKey: ['pages', slug],
    queryFn: () => pagesApi.getPublic(slug),
  });

  if (isError) return <Navigate to="/404" replace />;

  return (
    <>
      <Helmet>
        <title>{page?.seo?.title || `${page?.title || fallbackTitle} — SpyDev`}</title>
      </Helmet>

      <Container className="max-w-3xl py-20">
        {isLoading ? (
          <>
            <Skeleton className="h-10 w-64" />
            <Skeleton className="mt-6 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-5/6" />
          </>
        ) : (
          <Reveal>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {page?.title || fallbackTitle}
            </h1>
            <div
              className="prose prose-neutral dark:prose-invert mt-8 max-w-none text-muted-foreground [&_a]:text-accent [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-foreground [&_p]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: page?.content || '<p>This page has not been published yet.</p>' }}
            />
          </Reveal>
        )}
      </Container>
    </>
  );
}
