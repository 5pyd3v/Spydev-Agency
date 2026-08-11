import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AnnouncementBanner } from '@/components/layout/AnnouncementBanner';

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AnnouncementBanner />
      <Navbar />
      <main className="flex-1 pt-28">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
