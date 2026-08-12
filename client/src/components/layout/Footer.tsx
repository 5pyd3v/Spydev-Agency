import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail } from 'lucide-react';
import { Logo } from './Logo';
import { Container } from '@/components/ui/Container';
import { useSettings } from '@/hooks/queries/useSettings';

// lucide-react no longer ships brand/logo icons — social links render the
// platform's initial in a badge instead of a wordmark icon.

const FOOTER_COLUMNS = [
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Projects', href: '/projects' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Services',
    links: [
      { label: 'Web Development', href: '/services' },
      { label: 'AI Agents & Automation', href: '/services' },
      { label: 'Cybersecurity', href: '/services' },
      { label: 'UI/UX Engineering', href: '/services' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
];

export function Footer() {
  const { data: settings } = useSettings();

  return (
    <footer className="relative mt-32 bg-footer-bg">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo tone="footer" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-footer-foreground/85">
              {settings?.tagline ?? 'Digital Products. Engineered to Move Businesses Forward.'}
            </p>
            {settings?.contactEmail && (
              <a
                href={`mailto:${settings.contactEmail}`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-footer-foreground hover:text-footer-foreground/70"
              >
                <Mail className="h-4 w-4" />
                {settings.contactEmail}
              </a>
            )}
            {settings?.socialLinks && settings.socialLinks.filter((s) => s.enabled).length > 0 && (
              <div className="mt-6 flex items-center gap-2">
                {settings.socialLinks
                  .filter((s) => s.enabled)
                  .map((social) => (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.platform}
                      title={social.platform}
                      className="group flex h-9 w-9 items-center justify-center rounded-full border border-footer-foreground/25 text-xs font-semibold text-footer-foreground/90 transition-colors hover:border-footer-foreground/50 hover:text-footer-foreground/70"
                    >
                      <span className="group-hover:hidden">{social.platform.charAt(0).toUpperCase()}</span>
                      <ArrowUpRight className="hidden h-4 w-4 group-hover:block" />
                    </a>
                  ))}
              </div>
            )}
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-sm font-semibold text-footer-foreground">{col.heading}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-footer-foreground/85 transition-colors hover:text-footer-foreground/70"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-footer-foreground/15 pt-6 text-xs text-footer-foreground/75 sm:flex-row">
          <p>{settings?.footerText ?? `© ${new Date().getFullYear()} SpyDev. All rights reserved.`}</p>
          <p>Built by SpyDev — Web · Mobile · AI · Cybersecurity</p>
        </div>
      </Container>
    </footer>
  );
}
