import { useEffect, useState } from 'react';
import { Link, NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Menu, Moon, Sun, X } from 'lucide-react';
import { Logo } from './Logo';
import { NAV_LINKS } from './NavLinks.data';
import { buttonVariants } from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';
import { usePublicServices } from '@/hooks/queries/useServices';
import { usePublicNavigation } from '@/hooks/queries/useNavigation';
import { cn } from '@/utils/cn';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const { data: services } = usePublicServices();
  const { data: navItems } = usePublicNavigation();

  // Admin-managed header links win once configured; static defaults keep the
  // navbar populated before any Navigation entries exist.
  const headerLinks = navItems?.filter((n) => n.location === 'header') ?? [];
  const navLinks = headerLinks.length > 0 ? headerLinks.map((n) => ({ label: n.label, href: n.url })) : NAV_LINKS;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={cn(
          'glass flex w-full max-w-6xl items-center justify-between gap-4 rounded-2xl px-4 py-2.5 transition-shadow duration-300',
          scrolled ? 'shadow-soft' : 'shadow-none'
        )}
      >
        <Logo />

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) =>
            link.label === 'Services' ? (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <RouterNavLink
                  to={link.href}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                      isActive && 'text-foreground'
                    )
                  }
                >
                  {link.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </RouterNavLink>
                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="glass absolute left-1/2 top-full mt-2 w-72 -translate-x-1/2 rounded-2xl p-2 shadow-soft"
                    >
                      {services && services.length > 0 ? (
                        services.slice(0, 6).map((service) => (
                          <Link
                            key={service._id}
                            to={`/services/${service.slug}`}
                            className="block rounded-xl px-3 py-2.5 text-sm text-foreground/90 transition-colors hover:bg-surface-hover"
                          >
                            <span className="font-medium">{service.title}</span>
                            <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                              {service.shortDescription}
                            </span>
                          </Link>
                        ))
                      ) : (
                        <div className="px-3 py-2.5 text-sm text-muted-foreground">No services yet</div>
                      )}
                      <Link
                        to="/services"
                        className="mt-1 flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-accent hover:bg-surface-hover"
                      >
                        View all services
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <RouterNavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                    isActive && 'text-foreground'
                  )
                }
              >
                {link.label}
              </RouterNavLink>
            )
          )}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link to="/start-project" className={buttonVariants({ size: 'sm' })}>
            Start a project
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          className="flex h-10 w-10 items-center justify-center rounded-full text-foreground lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="glass absolute inset-x-4 top-[calc(100%+0.5rem)] rounded-2xl p-3 shadow-soft lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <RouterNavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    cn(
                      'rounded-xl px-4 py-3 text-base font-medium text-foreground/90 transition-colors hover:bg-surface-hover',
                      isActive && 'bg-surface-hover text-foreground'
                    )
                  }
                >
                  {link.label}
                </RouterNavLink>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2 border-t border-border pt-3">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <Link to="/start-project" className={cn(buttonVariants({ size: 'md' }), 'flex-1')}>
                Start a project
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
