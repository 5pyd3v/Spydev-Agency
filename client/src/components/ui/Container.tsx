import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mx-auto w-full max-w-[80rem] px-5 sm:px-6 lg:px-8', className)} {...props} />;
}
