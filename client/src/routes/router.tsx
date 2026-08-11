import { lazy, Suspense, type ComponentType } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PageLoader } from '@/components/PageLoader';
import { Home } from '@/pages/public/Home';
import { NotFound } from '@/pages/public/NotFound';

// Route-based code splitting: the homepage (and 404) load eagerly for the
// fastest first paint; everything else — and the entire admin panel, which
// pulls in Tiptap and dnd-kit — loads on demand so public visitors never
// download admin-only code.
function lazyPage<P extends object>(loader: () => Promise<{ [key: string]: ComponentType<P> }>, named: string) {
  const Lazy = lazy(() => loader().then((mod) => ({ default: mod[named] as ComponentType<P> })));
  return (props: P) => (
    <Suspense fallback={<PageLoader />}>
      <Lazy {...props} />
    </Suspense>
  );
}

const ServicesListPage = lazyPage(() => import('@/pages/public/ServicesListPage'), 'ServicesListPage');
const ServiceDetailPage = lazyPage(() => import('@/pages/public/ServiceDetailPage'), 'ServiceDetailPage');
const ProjectsListPage = lazyPage(() => import('@/pages/public/ProjectsListPage'), 'ProjectsListPage');
const ProjectDetailPage = lazyPage(() => import('@/pages/public/ProjectDetailPage'), 'ProjectDetailPage');
const CaseStudiesListPage = lazyPage(() => import('@/pages/public/CaseStudiesListPage'), 'CaseStudiesListPage');
const CaseStudyDetailPage = lazyPage(() => import('@/pages/public/CaseStudyDetailPage'), 'CaseStudyDetailPage');
const AboutPage = lazyPage(() => import('@/pages/public/AboutPage'), 'AboutPage');
const TeamPage = lazyPage(() => import('@/pages/public/TeamPage'), 'TeamPage');
const BlogListPage = lazyPage(() => import('@/pages/public/BlogListPage'), 'BlogListPage');
const BlogPostPage = lazyPage(() => import('@/pages/public/BlogPostPage'), 'BlogPostPage');
const ContactPage = lazyPage(() => import('@/pages/public/ContactPage'), 'ContactPage');
const StartProjectPage = lazyPage(() => import('@/pages/public/StartProjectPage'), 'StartProjectPage');
const StaticPage = lazyPage<{ slug: string; fallbackTitle: string }>(() => import('@/pages/public/StaticPage'), 'StaticPage');

const AdminLoginPage = lazyPage(() => import('@/pages/admin/AdminLoginPage'), 'AdminLoginPage');
const AdminDashboardPage = lazyPage(() => import('@/pages/admin/AdminDashboardPage'), 'AdminDashboardPage');
const AdminServicesPage = lazyPage(() => import('@/pages/admin/services/AdminServicesPage'), 'AdminServicesPage');
const AdminHomepageSectionsPage = lazyPage(() => import('@/pages/admin/homepage/AdminHomepageSectionsPage'), 'AdminHomepageSectionsPage');
const AdminTeamPage = lazyPage(() => import('@/pages/admin/team/AdminTeamPage'), 'AdminTeamPage');
const AdminTechnologiesPage = lazyPage(() => import('@/pages/admin/technologies/AdminTechnologiesPage'), 'AdminTechnologiesPage');
const AdminProcessPage = lazyPage(() => import('@/pages/admin/process/AdminProcessPage'), 'AdminProcessPage');
const AdminTestimonialsPage = lazyPage(() => import('@/pages/admin/testimonials/AdminTestimonialsPage'), 'AdminTestimonialsPage');
const AdminPricingPage = lazyPage(() => import('@/pages/admin/pricing/AdminPricingPage'), 'AdminPricingPage');
const AdminFaqsPage = lazyPage(() => import('@/pages/admin/faqs/AdminFaqsPage'), 'AdminFaqsPage');
const AdminClientsPage = lazyPage(() => import('@/pages/admin/clients/AdminClientsPage'), 'AdminClientsPage');
const AdminProjectsPage = lazyPage(() => import('@/pages/admin/projects/AdminProjectsPage'), 'AdminProjectsPage');
const AdminCaseStudiesPage = lazyPage(() => import('@/pages/admin/caseStudies/AdminCaseStudiesPage'), 'AdminCaseStudiesPage');
const AdminBlogListPage = lazyPage(() => import('@/pages/admin/blog/AdminBlogListPage'), 'AdminBlogListPage');
const AdminBlogEditorPage = lazyPage(() => import('@/pages/admin/blog/AdminBlogEditorPage'), 'AdminBlogEditorPage');
const AdminLeadsPage = lazyPage(() => import('@/pages/admin/leads/AdminLeadsPage'), 'AdminLeadsPage');
const AdminMediaPage = lazyPage(() => import('@/pages/admin/media/AdminMediaPage'), 'AdminMediaPage');
const AdminNavigationPage = lazyPage(() => import('@/pages/admin/navigation/AdminNavigationPage'), 'AdminNavigationPage');
const AdminAppearancePage = lazyPage(() => import('@/pages/admin/settings/AdminAppearancePage'), 'AdminAppearancePage');
const AdminSeoPage = lazyPage(() => import('@/pages/admin/settings/AdminSeoPage'), 'AdminSeoPage');
const AdminSettingsPage = lazyPage(() => import('@/pages/admin/settings/AdminSettingsPage'), 'AdminSettingsPage');
const AdminUsersPage = lazyPage(() => import('@/pages/admin/users/AdminUsersPage'), 'AdminUsersPage');
const AdminPagesPage = lazyPage(() => import('@/pages/admin/pages/AdminPagesPage'), 'AdminPagesPage');

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/services', element: <ServicesListPage /> },
      { path: '/services/:slug', element: <ServiceDetailPage /> },
      { path: '/projects', element: <ProjectsListPage /> },
      { path: '/projects/:slug', element: <ProjectDetailPage /> },
      { path: '/case-studies', element: <CaseStudiesListPage /> },
      { path: '/case-studies/:slug', element: <CaseStudyDetailPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/team', element: <TeamPage /> },
      { path: '/blog', element: <BlogListPage /> },
      { path: '/blog/:slug', element: <BlogPostPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/start-project', element: <StartProjectPage /> },
      { path: '/privacy-policy', element: <StaticPage slug="privacy-policy" fallbackTitle="Privacy Policy" /> },
      { path: '/terms', element: <StaticPage slug="terms" fallbackTitle="Terms of Service" /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  { path: '/admin/login', element: <AdminLoginPage /> },
  {
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'pages', element: <AdminPagesPage /> },
          { path: 'homepage-sections', element: <AdminHomepageSectionsPage /> },
          { path: 'services', element: <AdminServicesPage /> },
          { path: 'projects', element: <AdminProjectsPage /> },
          { path: 'case-studies', element: <AdminCaseStudiesPage /> },
          { path: 'blog', element: <AdminBlogListPage /> },
          { path: 'blog/new', element: <AdminBlogEditorPage /> },
          { path: 'blog/:id', element: <AdminBlogEditorPage /> },
          { path: 'testimonials', element: <AdminTestimonialsPage /> },
          { path: 'clients', element: <AdminClientsPage /> },
          { path: 'team', element: <AdminTeamPage /> },
          { path: 'technologies', element: <AdminTechnologiesPage /> },
          { path: 'process', element: <AdminProcessPage /> },
          { path: 'pricing', element: <AdminPricingPage /> },
          { path: 'faqs', element: <AdminFaqsPage /> },
          { path: 'leads', element: <AdminLeadsPage /> },
          { path: 'media', element: <AdminMediaPage /> },
          { path: 'navigation', element: <AdminNavigationPage /> },
          { path: 'appearance', element: <AdminAppearancePage /> },
          { path: 'seo', element: <AdminSeoPage /> },
          { path: 'settings', element: <AdminSettingsPage /> },
          {
            path: 'users',
            element: <ProtectedRoute roles={['superadmin']} />,
            children: [{ index: true, element: <AdminUsersPage /> }],
          },
        ],
      },
    ],
  },
]);
