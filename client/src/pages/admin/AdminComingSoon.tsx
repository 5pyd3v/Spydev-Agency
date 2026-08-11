import { Construction } from 'lucide-react';

export function AdminComingSoon({ title }: { title: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl border border-dashed border-border text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface text-accent">
        <Construction className="h-6 w-6" />
      </div>
      <h1 className="mt-6 font-display text-xl font-semibold text-foreground">{title}</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        This admin module is being built out in a later phase.
      </p>
    </div>
  );
}
