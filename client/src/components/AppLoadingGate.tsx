import { useEffect, useState } from 'react';
import { useSettings } from '@/hooks/queries/useSettings';
import { SpyDevMark } from '@/components/brand/SpyDevMark';
import { cn } from '@/utils/cn';

// Render's free-tier backend can take up to ~30-50s to wake from a cold
// start. This just observes the settings fetch that AppearanceInjector
// already makes on mount (same React Query cache key, so no extra request
// goes out) and covers the screen with a branded splash until it resolves,
// instead of visitors staring at a blank page while the server wakes up.
const MAX_WAIT_MS = 25000;
const FADE_MS = 500;
// Once no image is pending and no new one has appeared for this long,
// consider the page settled — short enough to stay snappy, long enough to
// absorb the gap between one image finishing and the next mounting.
const SETTLE_MS = 350;

/**
 * True once every <img> currently in the document (and every one added
 * afterwards, via a MutationObserver) has fired load/error at least once,
 * debounced by SETTLE_MS. Doesn't start watching until `active` is true, so
 * it only tracks images that belong to the real page, not a transient
 * pre-data render.
 */
function useAllImagesLoaded(active: boolean): boolean {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!active || loaded) return;

    const pending = new Set<HTMLImageElement>();
    let settleTimer: ReturnType<typeof setTimeout> | null = null;

    const checkSettled = () => {
      if (settleTimer) {
        clearTimeout(settleTimer);
        settleTimer = null;
      }
      if (pending.size === 0) {
        settleTimer = setTimeout(() => setLoaded(true), SETTLE_MS);
      }
    };

    const track = (img: HTMLImageElement) => {
      if (img.complete || pending.has(img)) return;
      pending.add(img);
      const onDone = () => {
        pending.delete(img);
        img.removeEventListener('load', onDone);
        img.removeEventListener('error', onDone);
        checkSettled();
      };
      img.addEventListener('load', onDone);
      img.addEventListener('error', onDone);
    };

    document.querySelectorAll('img').forEach((img) => track(img as HTMLImageElement));
    checkSettled();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.tagName === 'IMG') track(node as HTMLImageElement);
          node.querySelectorAll?.('img').forEach((img) => track(img as HTMLImageElement));
        });
      }
      checkSettled();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      if (settleTimer) clearTimeout(settleTimer);
    };
  }, [active, loaded]);

  return loaded;
}

export function AppLoadingGate() {
  const { isLoading, isError } = useSettings();
  const settingsReady = !isLoading || isError;
  const imagesReady = useAllImagesLoaded(settingsReady);
  const [timedOut, setTimedOut] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const ready = (settingsReady && imagesReady) && !dismissed;
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
