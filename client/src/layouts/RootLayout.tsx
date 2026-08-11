import { Outlet } from 'react-router-dom';
import { AppearanceInjector } from '@/components/AppearanceInjector';
import { ScrollToTop } from '@/components/ScrollToTop';

/**
 * Sits inside <RouterProvider> (unlike providers in main.tsx) so children
 * that need route context — like AppearanceInjector's and ScrollToTop's
 * useLocation() calls — actually have a Router to read from.
 */
export function RootLayout() {
  return (
    <>
      <AppearanceInjector />
      <ScrollToTop />
      <Outlet />
    </>
  );
}
