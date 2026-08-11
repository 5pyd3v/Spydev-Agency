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
import { getIcon } from '@/utils/icons';
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
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4">
      <nav
        className={cn(
          'glass flex w-full max-w-6xl items-center justify-between gap-3 rounded-2xl px-3 py-2 transition-shadow duration-300 sm:gap-4 sm:px-4 sm:py-2.5',
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
                      'nav-underline flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                      isActive && 'text-foreground'
                    )
                  }
                  data-active={location.pathname.startsWith(link.href)}
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
                      className="absolute left-1/2 top-full mt-2 w-80 -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-background shadow-[0_24px_60px_-20px_rgba(0,0,0,0.25)]"
                    >
                      <p className="px-4 pt-3.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                        Our services
                      </p>
                      <div className="p-1.5">
                        {services && services.length > 0 ? (
                          services.slice(0, 6).map((service) => {
                            const ServiceIcon = getIcon(service.icon);
                            return (
                              <Link
                                key={service._id}
                                to={`/services/${service.slug}`}
                                className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface"
                              >
                                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                                  <ServiceIcon className="h-4 w-4" />
                                </span>
                                <span className="min-w-0">
                                  <span className="block text-sm font-medium text-foreground">{service.title}</span>
                                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                                    {service.shortDescription}
                                  </span>
                                </span>
                              </Link>
                            );
                          })
                        ) : (
                          <div className="px-3 py-2.5 text-sm text-muted-foreground">No services yet</div>
                        )}
                      </div>
                      <Link
                        to="/services"
                        className="flex items-center justify-between bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
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
                    'nav-underline rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                    isActive && 'text-foreground'
                  )
                }
                data-active={location.pathname === link.href}
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
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              aria-hidden
            />
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-3 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-border bg-background p-2 shadow-2xl sm:inset-x-4 sm:p-3 lg:hidden"
            >
              <div className="flex flex-col gap-0.5 sm:gap-1">
                {navLinks.map((link) => (
                  <RouterNavLink
                    key={link.href}
                    to={link.href}
                    className={({ isActive }) =>
                      cn(
                        'rounded-xl px-3.5 py-2.5 text-sm font-medium text-foreground/90 transition-colors hover:bg-surface-hover sm:px-4 sm:py-3 sm:text-base',
                        isActive && 'bg-surface-hover text-foreground'
                      )
                    }
                  >
                    {link.label}
                  </RouterNavLink>
                ))}
              </div>
              <div className="mt-1.5 flex items-center gap-2 border-t border-border pt-2.5 sm:mt-2 sm:pt-3">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
                <Link to="/start-project" className={cn(buttonVariants({ size: 'sm' }), 'flex-1')}>
                  Start a project
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
