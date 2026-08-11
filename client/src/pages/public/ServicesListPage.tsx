import { Helmet } from 'react-helmet-async';
import { Container } from '@/components/ui/Container';
import { Skeleton } from '@/components/ui/Skeleton';
import { Reveal } from '@/components/ui/Reveal';
import { ServiceCard } from '@/components/services/ServiceCard';
import { usePublicServices } from '@/hooks/queries/useServices';
import { staggerContainer } from '@/animations/variants';
import { motion } from 'framer-motion';

export function ServicesListPage() {
  const { data: services, isLoading } = usePublicServices();

  return (
    <>
      <Helmet>
        <title>Services — SpyDev</title>
        <meta
          name="description"
          content="Web, mobile, AI, and cybersecurity services engineered for serious businesses."
        />
      </Helmet>

      <Container className="py-20">
        <Reveal>
          <span className="text-sm font-medium text-accent">What we do</span>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            End-to-end technology services for serious businesses.
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground">
            From product engineering to offensive security — every service is delivered by a team that ships
            production-grade work.
          </p>
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer(0.08)}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-3xl" />)}

          {!isLoading && services?.length === 0 && (
            <p className="col-span-full text-sm text-muted-foreground">No services published yet.</p>
          )}

          {services?.map((service, i) => (
            <motion.div key={service._id} variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}>
              <ServiceCard service={service} index={i} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </>
  );
}
