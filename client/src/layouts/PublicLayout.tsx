import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AnnouncementBanner } from '@/components/layout/AnnouncementBanner';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function PublicLayout() {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex min-h-screen-safe flex-col bg-background text-foreground">
      <AnnouncementBanner />
      <Navbar />
      <main className="flex-1 pt-28">
        <motion.div
          key={location.pathname}
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <Outlet />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
