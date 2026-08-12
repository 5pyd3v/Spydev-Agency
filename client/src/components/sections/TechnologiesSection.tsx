import type { CSSProperties } from 'react';
import { useQuery } from '@tanstack/react-query';
import { technologiesApi } from '@/api/entities.api';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { getIcon } from '@/utils/icons';
import { CARD_TONES } from '@/utils/cardTones';
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
          {technologies.map((tech, i) => {
            const Icon = getIcon(tech.icon);
            const tone = CARD_TONES[i % CARD_TONES.length];
            return (
              <span
                key={tech._id}
                className="flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2 text-sm font-medium text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--tone-border)] hover:shadow-md"
                style={{ '--tone-border': tone.bg } as CSSProperties}
              >
                <Icon className="h-4 w-4" style={{ color: tone.bg }} />
                {tech.name}
              </span>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
