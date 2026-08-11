import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  FileText,
  LayoutTemplate,
  Briefcase,
  FolderKanban,
  BookOpen,
  Quote,
  Building2,
  Users as UsersIcon,
  Cpu,
  GitBranch,
  Tag,
  HelpCircle,
  Newspaper,
  Inbox,
  Image,
  Compass,
  Palette,
  Search,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import type { UserRole } from '@/types';

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles?: UserRole[];
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', href: '/admin', icon: LayoutDashboard }],
  },
  {
    label: 'Content',
    items: [
      { label: 'Pages', href: '/admin/pages', icon: FileText },
      { label: 'Homepage', href: '/admin/homepage-sections', icon: LayoutTemplate },
      { label: 'Services', href: '/admin/services', icon: Briefcase },
      { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
      { label: 'Case Studies', href: '/admin/case-studies', icon: BookOpen },
      { label: 'Blog', href: '/admin/blog', icon: Newspaper },
      { label: 'Testimonials', href: '/admin/testimonials', icon: Quote },
      { label: 'Clients', href: '/admin/clients', icon: Building2 },
      { label: 'Team', href: '/admin/team', icon: UsersIcon },
      { label: 'Technologies', href: '/admin/technologies', icon: Cpu },
      { label: 'Process', href: '/admin/process', icon: GitBranch },
      { label: 'Pricing', href: '/admin/pricing', icon: Tag },
      { label: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
    ],
  },
  {
    label: 'Growth',
    items: [
      { label: 'Leads', href: '/admin/leads', icon: Inbox },
      { label: 'Media', href: '/admin/media', icon: Image },
    ],
  },
  {
    label: 'Site',
    items: [
      { label: 'Navigation', href: '/admin/navigation', icon: Compass },
      { label: 'Appearance', href: '/admin/appearance', icon: Palette },
      { label: 'SEO', href: '/admin/seo', icon: Search },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
  {
    label: 'Admin',
    items: [{ label: 'Users', href: '/admin/users', icon: ShieldCheck, roles: ['superadmin'] }],
  },
];
