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
        <Reveal className="relative overflow-hidden rounded-[2.5rem] bg-foreground px-8 py-16 text-center sm:px-16">
          {/* Confident dark block breaking up the light page — accented with the
              brand's lime and pink, not a flat repeat of the same hue. */}
          <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-accent/25 blur-[110px]" aria-hidden />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#ff2ec4]/20 blur-[100px]" aria-hidden />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" aria-hidden />

          <h2 className="relative font-display text-3xl font-semibold tracking-tight text-background sm:text-4xl">
            {content.heading || section.heading || 'Have a project in mind?'}
          </h2>
          {(content.description || section.subheading) && (
            <p className="relative mx-auto mt-4 max-w-xl text-background/70">
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
