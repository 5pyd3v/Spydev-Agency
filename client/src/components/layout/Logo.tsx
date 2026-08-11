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
    <Link to="/" className={cn('flex shrink-0 items-center gap-2', className)} aria-label={`${siteName} home`}>
      {logoUrl ? (
        <img src={logoUrl} alt={siteName} className="h-7 w-auto sm:h-8" />
      ) : (
        <SpyDevMark size={28} className="sm:hidden" />
      )}
      {!logoUrl && <SpyDevMark size={32} className="hidden sm:block" />}
      <span
        className={cn(
          'font-display text-base font-bold uppercase tracking-wide sm:text-lg',
          tone === 'footer' ? 'text-footer-foreground' : 'text-foreground'
        )}
      >
        {siteName}
      </span>
    </Link>
  );
}
