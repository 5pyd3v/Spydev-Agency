import { Link } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { buttonVariants } from '@/components/ui/Button';

export function ComingSoon({ title }: { title: string }) {
  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface text-accent">
        <Construction className="h-6 w-6" />
      </div>
      <h1 className="mt-6 font-display text-3xl font-semibold text-foreground">{title}</h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        This page is being built out. Check back soon — or head back home in the meantime.
      </p>
      <Link to="/" className={buttonVariants({ variant: 'secondary', size: 'sm', className: 'mt-8' })}>
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to home
      </Link>
    </Container>
  );
}
