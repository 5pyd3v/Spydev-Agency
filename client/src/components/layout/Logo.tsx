import { Link } from 'react-router-dom';
import { useSettings } from '@/hooks/queries/useSettings';

export function Logo({ className }: { className?: string }) {
  const { data: settings } = useSettings();
  const siteName = settings?.siteName ?? 'SpyDev';
  const logoUrl = settings?.logoUrl;

  return (
    <Link to="/" className={`flex items-center gap-2 shrink-0 ${className ?? ''}`} aria-label={`${siteName} home`}>
      {logoUrl ? (
        <img src={logoUrl} alt={siteName} className="h-8 w-auto" />
      ) : (
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-accent-foreground font-display font-bold">
          {siteName.charAt(0)}
        </span>
      )}
      <span className="font-display text-lg font-semibold tracking-tight text-foreground">{siteName}</span>
    </Link>
  );
}
