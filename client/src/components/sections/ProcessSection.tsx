import { useQuery } from '@tanstack/react-query';
import { processApi } from '@/api/entities.api';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { getIcon } from '@/utils/icons';
import { cn } from '@/utils/cn';
import type { HomepageSection } from '@/types';

const ICON_TONES = ['bg-accent text-accent-foreground', 'bg-secondary text-secondary-foreground', 'bg-accent-alt text-white', 'bg-foreground text-background'];

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
              <Reveal
                key={step._id}
                delay={i * 0.05}
                className="group rounded-3xl border border-border bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_-20px_rgba(0,0,0,0.35)]"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110',
                      ICON_TONES[i % ICON_TONES.length]
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="font-display text-sm text-muted-foreground/50">{String(i + 1).padStart(2, '0')}</span>
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
