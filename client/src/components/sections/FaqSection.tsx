import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqsApi } from '@/api/entities.api';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/utils/cn';
import type { HomepageSection } from '@/types';

export function FaqSection({ section }: { section: HomepageSection }) {
  const { data: faqs } = useQuery({ queryKey: ['faqs', 'public'], queryFn: () => faqsApi.listPublic() });
  const [openId, setOpenId] = useState<string | null>(null);
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-20 sm:py-28">
      <Container className="max-w-3xl">
        <Reveal className="text-center">
          <span className="text-sm font-medium text-accent">FAQ</span>
          <h2 className="mx-auto mt-3 max-w-xl font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {section.heading || 'Frequently asked questions'}
          </h2>
        </Reveal>

        <Reveal className="mt-12 divide-y divide-border overflow-hidden rounded-3xl border border-border bg-surface">
          {faqs.map((faq) => {
            const isOpen = openId === faq._id;
            return (
              <div key={faq._id}>
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : faq._id)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-surface-hover"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-medium text-foreground">{faq.question}</span>
                  <span
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300',
                      isOpen ? 'rotate-180 bg-secondary text-secondary-foreground' : 'bg-background text-muted-foreground'
                    )}
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">{faq.answer}</div>
                )}
              </div>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
