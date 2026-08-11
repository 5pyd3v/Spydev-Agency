import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { buttonVariants } from '@/components/ui/Button';

export function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <span className="font-display text-8xl font-bold text-gradient">404</span>
      <h1 className="mt-4 font-display text-2xl font-semibold text-foreground">Page not found</h1>
      <p className="mt-3 max-w-sm text-sm text-muted-foreground">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/" className={buttonVariants({ size: 'sm', className: 'mt-8' })}>
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to home
      </Link>
    </Container>
  );
}
