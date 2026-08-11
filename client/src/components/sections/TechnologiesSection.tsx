import { useQuery } from '@tanstack/react-query';
import { technologiesApi } from '@/api/entities.api';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { getIcon } from '@/utils/icons';
import type { HomepageSection } from '@/types';

export function TechnologiesSection({ section }: { section: HomepageSection }) {
  const { data: technologies } = useQuery({
    queryKey: ['technologies', 'public'],
    queryFn: () => technologiesApi.listPublic(),
  });
  if (!technologies || technologies.length === 0) return null;

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal className="text-center">
          <span className="text-sm font-medium text-accent">Our stack</span>
          <h2 className="mx-auto mt-3 max-w-xl font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {section.heading || 'Technologies we work with'}
          </h2>
        </Reveal>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {technologies.map((tech) => {
            const Icon = getIcon(tech.icon);
            return (
              <span
                key={tech._id}
                className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground transition-colors hover:border-accent/40"
              >
                <Icon className="h-4 w-4 text-accent" />
                {tech.name}
              </span>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
