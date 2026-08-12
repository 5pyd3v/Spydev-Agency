import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { Skeleton } from '@/components/ui/Skeleton';
import { ServiceCard } from '@/components/services/ServiceCard';
import { usePublicServices } from '@/hooks/queries/useServices';
import { fadeInUp, reducedMotionVariants } from '@/animations/variants';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { HomepageSection } from '@/types';

export function ServicesSection({ section }: { section: HomepageSection }) {
  const { data: services, isLoading } = usePublicServices();
  const prefersReducedMotion = useReducedMotion();

  if (!isLoading && services?.length === 0) return null;

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="text-sm font-medium text-accent">What we do</span>
            <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {section.heading || 'End-to-end technology services'}
            </h2>
            {section.subheading && (
              <p className="mt-3 max-w-lg text-muted-foreground">{section.subheading}</p>
            )}
          </div>
          <Link
            to="/services"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-foreground hover:text-secondary sm:flex"
          >
            View all services
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-3xl" />)}
          {services?.slice(0, 6).map((service, i) => (
            <motion.div
              key={service._id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={prefersReducedMotion ? reducedMotionVariants : fadeInUp}
              transition={{ delay: (i % 3) * 0.06 }}
            >
              <ServiceCard service={service} index={i} />
            </motion.div>
          ))}
        </div>

        <Link
          to="/services"
          className="mt-8 flex items-center justify-center gap-1.5 rounded-full py-3 text-sm font-medium text-foreground hover:text-secondary sm:hidden"
        >
          View all services
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Container>
    </section>
  );
}
