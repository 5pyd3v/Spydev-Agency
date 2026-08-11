import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/Skeleton';
import { Reveal } from '@/components/ui/Reveal';
import { buttonVariants } from '@/components/ui/Button';
import { usePublicService } from '@/hooks/queries/useServices';
import { getIcon } from '@/utils/icons';

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: service, isLoading, isError } = usePublicService(slug);

  if (isError) return <Navigate to="/404" replace />;

  if (isLoading) {
    return (
      <Container className="py-20">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-6 h-16 w-full max-w-2xl" />
        <Skeleton className="mt-10 h-96 w-full rounded-3xl" />
      </Container>
    );
  }

  if (!service) return null;

  const Icon = getIcon(service.icon);

  return (
    <>
      <Helmet>
        <title>{service.seo?.title || `${service.title} — SpyDev`}</title>
        <meta name="description" content={service.seo?.description || service.shortDescription} />
      </Helmet>

      <Container className="py-16">
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All services
        </Link>

        <Reveal className="mt-6 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface text-accent">
              <Icon className="h-6 w-6" />
            </div>
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {service.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {service.shortDescription}
            </p>

            {service.fullDescription && (
              <p className="mt-6 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {service.fullDescription}
              </p>
            )}

            {service.features.length > 0 && (
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {service.features.map((feature) => {
                  const FeatureIcon = getIcon(feature.icon);
                  return (
                    <div key={feature.title} className="rounded-2xl border border-border bg-surface p-5">
                      <FeatureIcon className="h-5 w-5 text-accent" />
                      <h3 className="mt-3 text-sm font-semibold text-foreground">{feature.title}</h3>
                      {feature.description && (
                        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                          {feature.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {service.process.length > 0 && (
              <div className="mt-14">
                <h2 className="font-display text-2xl font-semibold text-foreground">How we work</h2>
                <div className="mt-6 space-y-4">
                  {service.process.map((step, i) => (
                    <div key={step.title} className="flex gap-4 rounded-2xl border border-border bg-surface p-5">
                      <span className="font-display text-sm font-medium text-accent">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                        {step.description && (
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {service.faqs.length > 0 && (
              <div className="mt-14">
                <h2 className="font-display text-2xl font-semibold text-foreground">Frequently asked questions</h2>
                <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-surface">
                  {service.faqs.map((faq) => (
                    <details key={faq.question} className="group px-5 py-4">
                      <summary className="cursor-pointer list-none text-sm font-medium text-foreground">
                        {faq.question}
                      </summary>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="h-fit rounded-3xl border border-border bg-surface p-6 lg:sticky lg:top-28">
            <h3 className="text-sm font-semibold text-foreground">Technologies</h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {service.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-6 space-y-2 border-t border-border pt-6">
              {['Fixed scope, fixed timeline', 'Direct access to engineers', 'Post-launch support included'].map(
                (item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-accent" />
                    {item}
                  </div>
                )
              )}
            </div>

            <Link to={service.ctaUrl || '/start-project'} className={buttonVariants({ className: 'mt-6 w-full' })}>
              {service.ctaText || 'Start a project'}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </aside>
        </Reveal>
      </Container>
    </>
  );
}
