import { Helmet } from 'react-helmet-async';
import { Container } from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/Skeleton';
import { SectionRenderer } from '@/components/sections/SectionRenderer';
import { usePublicHomepageSections } from '@/hooks/queries/useHomepageSections';
import { useSettings } from '@/hooks/queries/useSettings';

export function Home() {
  const { data: sections, isLoading } = usePublicHomepageSections();
  const { data: settings } = useSettings();

  return (
    <>
      <Helmet>
        <title>{settings?.seoDefaults?.title || `${settings?.siteName ?? 'SpyDev'} — Digital Products, Engineered to Move Businesses Forward`}</title>
        <meta
          name="description"
          content={
            settings?.seoDefaults?.description ||
            'SpyDev is a premium technology agency building web, mobile, AI, and cybersecurity solutions.'
          }
        />
      </Helmet>

      {isLoading && (
        <Container className="py-24">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="mt-6 h-16 w-full max-w-2xl" />
          <Skeleton className="mt-10 h-96 w-full rounded-3xl" />
        </Container>
      )}

      {!isLoading && sections && sections.length === 0 && (
        <Container className="py-24 text-center text-sm text-muted-foreground">
          No homepage sections are enabled yet. Configure them from{' '}
          <code className="rounded bg-surface px-1.5 py-0.5">/admin/homepage-sections</code>.
        </Container>
      )}

      {sections && <SectionRenderer sections={sections} />}
    </>
  );
}
