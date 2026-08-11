import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { useCountUp } from '@/hooks/useCountUp';
import type { HomepageSection } from '@/types';

interface StatItem {
  label: string;
  value: number;
  suffix?: string;
}

function StatCounter({ item }: { item: StatItem }) {
  const { ref, value } = useCountUp(item.value);
  return (
    <div className="text-center">
      <p className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
        <span ref={ref}>{value}</span>
        {item.suffix}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{item.label}</p>
    </div>
  );
}

export function StatsSection({ section }: { section: HomepageSection }) {
  const items = (section.content.items as StatItem[] | undefined) ?? [];
  if (items.length === 0) return null;

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <Reveal className="grid grid-cols-2 gap-8 rounded-3xl border border-border bg-surface px-8 py-12 sm:grid-cols-4">
          {items.map((item) => (
            <StatCounter key={item.label} item={item} />
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
