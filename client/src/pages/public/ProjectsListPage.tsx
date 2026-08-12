import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { Skeleton } from '@/components/ui/Skeleton';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { projectsApi } from '@/api/projects.api';
import { fadeInUp, reducedMotionVariants } from '@/animations/variants';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/utils/cn';
import type { Project } from '@/types/entities';

const CATEGORIES: { label: string; value: Project['category'] | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Web', value: 'web' },
  { label: 'Mobile', value: 'mobile' },
  { label: 'AI', value: 'ai' },
  { label: 'SaaS', value: 'saas' },
  { label: 'Cybersecurity', value: 'cybersecurity' },
  { label: 'E-commerce', value: 'ecommerce' },
];

export function ProjectsListPage() {
  const [category, setCategory] = useState<Project['category'] | 'all'>('all');
  const { data, isLoading } = useQuery({
    queryKey: ['projects', 'public', 'list', category],
    queryFn: () => projectsApi.listPublic({ limit: 24, category: category === 'all' ? undefined : category }),
  });
  const projects = data?.data ?? [];
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      <Helmet>
        <title>Projects — SpyDev</title>
        <meta name="description" content="A selection of web, mobile, AI, and security projects built by SpyDev." />
      </Helmet>

      <Container className="py-20">
        <Reveal>
          <span className="text-sm font-medium text-accent">Our work</span>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Projects engineered to perform.
          </h1>
        </Reveal>

        <Reveal className="mt-8 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                category === c.value
                  ? 'border-accent bg-accent text-accent-foreground'
                  : 'border-border bg-surface text-muted-foreground hover:text-foreground'
              )}
            >
              {c.label}
            </button>
          ))}
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {isLoading && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-3xl" />)}

          {!isLoading && projects.length === 0 && (
            <p className="col-span-full text-sm text-muted-foreground">No projects found in this category.</p>
          )}

          {projects.map((project, i) => (
            <motion.div
              key={project._id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={prefersReducedMotion ? reducedMotionVariants : fadeInUp}
              transition={{ delay: (i % 2) * 0.06 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </Container>
    </>
  );
}
