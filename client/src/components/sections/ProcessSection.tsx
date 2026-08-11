import { useQuery } from '@tanstack/react-query';
import { processApi } from '@/api/entities.api';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { getIcon } from '@/utils/icons';
import type { HomepageSection } from '@/types';

export function ProcessSection({ section }: { section: HomepageSection }) {
  const { data: steps } = useQuery({ queryKey: ['process', 'public'], queryFn: () => processApi.listPublic() });
  if (!steps || steps.length === 0) return null;

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal className="text-center">
          <span className="text-sm font-medium text-accent">How we work</span>
          <h2 className="mx-auto mt-3 max-w-xl font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {section.heading || 'A process built for clarity'}
          </h2>
          {section.subheading && <p className="mx-auto mt-3 max-w-lg text-muted-foreground">{section.subheading}</p>}
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => {
            const Icon = getIcon(step.icon);
            return (
              <Reveal key={step._id} delay={i * 0.05} className="rounded-3xl border border-border bg-surface p-6">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-background text-accent">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="font-display text-sm text-muted-foreground/70">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="mt-5 text-sm font-semibold text-foreground">{step.title}</h3>
                {step.description && <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{step.description}</p>}
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
