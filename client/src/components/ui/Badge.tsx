import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const badgeVariants = cva('inline-flex items-center gap-1.5 rounded-full text-xs font-medium', {
  variants: {
    variant: {
      accent: 'bg-accent/10 text-accent border border-accent/20',
      neutral: 'bg-surface text-muted-foreground border border-border',
      success: 'bg-success/10 text-success border border-success/20',
      warning: 'bg-warning/10 text-warning border border-warning/20',
      danger: 'bg-danger/10 text-danger border border-danger/20',
      info: 'bg-info/10 text-info border border-info/20',
    },
    size: {
      sm: 'px-2.5 py-1',
      md: 'px-3 py-1.5',
    },
  },
  defaultVariants: { variant: 'neutral', size: 'sm' },
});

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}
