import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { buttonVariants } from '@/components/ui/Button';
import { HeroVisual } from './HeroVisual';
import { HeroImage } from './HeroImage';
import type { HeroSectionContent, HomepageSection } from '@/types';

export function HeroSection({ section }: { section: HomepageSection }) {
  const content = section.content as HeroSectionContent;

  return (
    <section className="relative overflow-hidden pb-20 pt-8 sm:pb-28">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
        <div>
          {content.badge && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-muted-foreground"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              {content.badge}
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]"
          >
            {content.headline || 'Digital Products. Engineered to Move Businesses Forward.'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {content.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            {content.primaryCta?.text && (
              <Link to={content.primaryCta.url || '/start-project'} className={buttonVariants({ size: 'lg' })}>
                {content.primaryCta.text}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            {content.secondaryCta?.text && (
              <Link
                to={content.secondaryCta.url || '/projects'}
                className={buttonVariants({ variant: 'secondary', size: 'lg' })}
              >
                {content.secondaryCta.text}
              </Link>
            )}
          </motion.div>

          {content.trustIndicators && content.trustIndicators.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-6"
            >
              {content.trustIndicators.map((item) => (
                <span key={item} className="text-sm font-medium text-muted-foreground">
                  {item}
                </span>
              ))}
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          {content.visualImage ? <HeroImage src={content.visualImage} /> : <HeroVisual />}
        </motion.div>
      </Container>
    </section>
  );
}
