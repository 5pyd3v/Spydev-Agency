import { motion, type Variants } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { fadeInUp, reducedMotionVariants } from '@/animations/variants';

interface RevealProps {
  children?: ReactNode;
  variants?: Variants;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  as?: 'div' | 'section' | 'li';
  dangerouslySetInnerHTML?: { __html: string };
}

export function Reveal({ children, variants = fadeInUp, delay = 0, className, style, as = 'div', dangerouslySetInnerHTML }: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay }}
      variants={prefersReducedMotion ? reducedMotionVariants : variants}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
    >
      {children}
    </MotionTag>
  );
}
