import { useEffect } from 'react';

/**
 * Admin screens use a calmer accent palette than the public site (see
 * `.admin-scope` in index.css). Modals/drawers portal to `document.body`,
 * which sits outside any wrapper div's DOM subtree, so CSS custom properties
 * set on a wrapper wouldn't inherit into them — toggling the class on
 * `<html>` instead means portaled content gets the right colors too.
 */
export function useAdminScope() {
  useEffect(() => {
    document.documentElement.classList.add('admin-scope');
    return () => {
      document.documentElement.classList.remove('admin-scope');
    };
  }, []);
}
