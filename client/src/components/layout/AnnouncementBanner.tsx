import { useState } from 'react';
import { X } from 'lucide-react';
import { useSettings } from '@/hooks/queries/useSettings';

const DISMISS_KEY = 'spydev-announcement-dismissed';

export function AnnouncementBanner() {
  const { data: settings } = useSettings();
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem(DISMISS_KEY) === '1');

  const announcement = settings?.announcement;
  if (!announcement?.enabled || !announcement.text || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem(DISMISS_KEY, '1');
  };

  return (
    <div className="relative z-40 flex items-center justify-center gap-3 bg-accent px-4 py-2.5 text-center text-sm font-medium text-accent-foreground">
      <span>
        {announcement.text}
        {announcement.linkUrl && announcement.linkText && (
          <a href={announcement.linkUrl} className="ml-2 underline underline-offset-2">
            {announcement.linkText}
          </a>
        )}
      </span>
      {announcement.dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss announcement"
          className="absolute right-4 flex h-6 w-6 items-center justify-center rounded-full hover:bg-black/10"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
