import { useQuery } from '@tanstack/react-query';
import { Star, Quote } from 'lucide-react';
import { testimonialsApi } from '@/api/entities.api';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import type { HomepageSection } from '@/types';

export function TestimonialsSection({ section }: { section: HomepageSection }) {
  const { data: testimonials } = useQuery({
    queryKey: ['testimonials', 'public'],
    queryFn: () => testimonialsApi.listPublic(),
  });
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal className="text-center">
          <span className="text-sm font-medium text-accent">Testimonials</span>
          <h2 className="mx-auto mt-3 max-w-xl font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {section.heading || 'What clients say'}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 6).map((t, i) => (
            <Reveal
              key={t._id}
              delay={i * 0.05}
              className="relative flex flex-col overflow-hidden rounded-3xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_-20px_rgba(0,0,0,0.35)]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                <Quote className="h-4 w-4" />
              </span>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">"{t.testimonial}"</p>
              <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                {t.avatar ? (
                  <img
                    src={t.avatar}
                    alt={t.clientName}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-background"
                  />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent ring-2 ring-background">
                    {t.clientName.charAt(0)}
                  </span>
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">{t.clientName}</p>
                  <p className="text-xs text-muted-foreground">{[t.position, t.company].filter(Boolean).join(' · ')}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, r) => (
                    <Star key={r} className="h-3 w-3 fill-warning text-warning" />
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
