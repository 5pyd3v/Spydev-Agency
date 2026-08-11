import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { pricingApi } from '@/api/entities.api';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { buttonVariants } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import type { HomepageSection } from '@/types';

export function PricingSection({ section }: { section: HomepageSection }) {
  const { data: plans } = useQuery({ queryKey: ['pricing', 'public'], queryFn: () => pricingApi.listPublic() });
  if (!plans || plans.length === 0) return null;

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal className="text-center">
          <span className="text-sm font-medium text-accent">Pricing</span>
          <h2 className="mx-auto mt-3 max-w-xl font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {section.heading || 'Simple, transparent packages'}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Reveal
              key={plan._id}
              className={cn(
                'flex flex-col rounded-3xl border p-7',
                plan.isPopular ? 'border-accent bg-surface shadow-glow' : 'border-border bg-surface'
              )}
            >
              {plan.isPopular && (
                <span className="mb-4 inline-flex w-fit items-center rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                  Most popular
                </span>
              )}
              <h3 className="font-display text-lg font-semibold text-foreground">{plan.name}</h3>
              <p className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-3xl font-semibold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">/ {plan.billingPeriod}</span>
              </p>
              {plan.description && <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>}

              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-foreground/90">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to={plan.ctaUrl || '/start-project'}
                className={buttonVariants({ variant: plan.isPopular ? 'primary' : 'secondary', className: 'mt-7' })}
              >
                {plan.ctaText || 'Get started'}
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
