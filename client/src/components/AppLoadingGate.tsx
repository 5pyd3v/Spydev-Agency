import { useEffect, useState } from 'react';
import { useSettings } from '@/hooks/queries/useSettings';
import { SpyDevMark } from '@/components/brand/SpyDevMark';
import { cn } from '@/utils/cn';

// Render's free-tier backend can take up to ~30-50s to wake from a cold
// start. This just observes the settings fetch that AppearanceInjector
// already makes on mount (same React Query cache key, so no extra request
// goes out) and covers the screen with a branded splash until it resolves,
// instead of visitors staring at a blank page while the server wakes up.
const MAX_WAIT_MS = 20000;
const FADE_MS = 500;

export function AppLoadingGate() {
  const { isLoading, isError } = useSettings();
  const [timedOut, setTimedOut] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const ready = (!isLoading || isError) && !dismissed;
  const shouldShow = !ready && !timedOut;

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), MAX_WAIT_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (ready || timedOut) {
      const timer = setTimeout(() => setDismissed(true), FADE_MS);
      return () => clearTimeout(timer);
    }
  }, [ready, timedOut]);

  if (dismissed) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[999] flex flex-col items-center justify-center gap-6 bg-background transition-opacity ease-out',
        shouldShow ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
      style={{ transitionDuration: `${FADE_MS}ms` }}
      aria-hidden={!shouldShow}
    >
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute inset-0 rounded-2xl bg-accent/20 [animation:ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" aria-hidden />
        <SpyDevMark size={40} className="relative rounded-2xl shadow-lg [animation:pulse_2s_ease-in-out_infinite]" />
      </div>

      <div className="text-center">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-foreground">SpyDev</p>
        <p className="mt-2 text-sm text-muted-foreground">Preparing your experience…</p>
      </div>

      <div className="h-1 w-40 overflow-hidden rounded-full bg-surface">
        <div className="h-full w-1/3 rounded-full bg-accent [animation:loader-sweep_1.4s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}
