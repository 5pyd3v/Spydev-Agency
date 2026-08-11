import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * React Router doesn't reset scroll position on navigation the way a
 * traditional multi-page site does — without this, going from the bottom of
 * a long page to a new route leaves you scrolled down on the new page too.
 * Skipped on POP (back/forward) so the browser's native scroll restoration
 * for those cases isn't fought.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType !== 'POP') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [pathname, navigationType]);

  return null;
}
