import { Outlet } from 'react-router-dom';
import { AppearanceInjector } from '@/components/AppearanceInjector';

/**
 * Sits inside <RouterProvider> (unlike providers in main.tsx) so children
 * that need route context — like AppearanceInjector's useLocation() call —
 * actually have a Router to read from.
 */
export function RootLayout() {
  return (
    <>
      <AppearanceInjector />
      <Outlet />
    </>
  );
}
