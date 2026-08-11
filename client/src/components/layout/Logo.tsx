import { Link } from 'react-router-dom';
import { useSettings } from '@/hooks/queries/useSettings';
import { SpyDevMark } from '@/components/brand/SpyDevMark';
import { cn } from '@/utils/cn';

interface LogoProps {
  className?: string;
  /** "footer" forces light wordmark text, independent of the page theme. */
  tone?: 'default' | 'footer';
}

export function Logo({ className, tone = 'default' }: LogoProps) {
  const { data: settings } = useSettings();
  const siteName = settings?.siteName ?? 'SpyDev';
  const logoUrl = settings?.logoUrl;

  return (
    <Link to="/" className={cn('flex items-center gap-2.5 shrink-0', className)} aria-label={`${siteName} home`}>
      {logoUrl ? <img src={logoUrl} alt={siteName} className="h-8 w-auto" /> : <SpyDevMark size={32} />}
      <span
        className={cn(
          'font-display text-lg font-bold uppercase tracking-wide',
          tone === 'footer' ? 'text-footer-foreground' : 'text-foreground'
        )}
      >
        {siteName}
      </span>
    </Link>
  );
}
