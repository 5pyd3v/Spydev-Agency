import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  accent?: boolean;
}

export function StatCard({ label, value, icon: Icon, hint, accent }: StatCardProps) {
  return (
    <div className="rounded-3xl border border-border bg-surface p-6">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-xl',
            accent ? 'bg-accent/10 text-accent' : 'bg-background text-muted-foreground'
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-4 font-display text-3xl font-semibold text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
