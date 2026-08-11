import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

export const buttonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-300 ease-out disabled:pointer-events-none disabled:opacity-50 select-none',
  {
    variants: {
      variant: {
        primary:
          'bg-accent text-accent-foreground shadow-[0_0_0_1px_rgba(0,0,0,0.05)] hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0',
        secondary:
          'bg-surface text-foreground border border-border hover:bg-surface-hover hover:-translate-y-0.5 active:translate-y-0',
        outline:
          'bg-transparent text-foreground border border-border hover:border-accent hover:text-accent',
        ghost: 'bg-transparent text-foreground hover:bg-surface-hover',
        link: 'bg-transparent text-accent underline-offset-4 hover:underline p-0',
      },
      size: {
        sm: 'h-9 px-4 text-sm rounded-full',
        md: 'h-11 px-6 text-sm rounded-full',
        lg: 'h-12 px-8 text-base rounded-full',
        icon: 'h-10 w-10 rounded-full',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = 'Button';
