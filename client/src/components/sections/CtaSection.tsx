import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { buttonVariants } from '@/components/ui/Button';
import type { CtaSectionContent, HomepageSection } from '@/types';

export function CtaSection({ section }: { section: HomepageSection }) {
  const content = section.content as CtaSectionContent;

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal className="relative overflow-hidden rounded-[2.5rem] border border-border bg-surface px-8 py-16 text-center sm:px-16">
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-64 w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[100px]"
            aria-hidden
          />
          <h2 className="relative font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {content.heading || section.heading || 'Have a project in mind?'}
          </h2>
          {(content.description || section.subheading) && (
            <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
              {content.description || section.subheading}
            </p>
          )}
          <div className="relative mt-8 flex justify-center">
            <Link to={content.buttonUrl || '/start-project'} className={buttonVariants({ size: 'lg' })}>
              {content.buttonText || 'Start a project'}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
