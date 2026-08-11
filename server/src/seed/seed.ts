import { connectDB, disconnectDB } from '../config/db.js';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { SiteSettings } from '../models/SiteSettings.js';
import { Service } from '../models/Service.js';
import { HomepageSection } from '../models/HomepageSection.js';
import { TeamMember } from '../models/TeamMember.js';
import { Technology } from '../models/Technology.js';
import { ProcessStep } from '../models/ProcessStep.js';
import { Testimonial } from '../models/Testimonial.js';
import { PricingPlan } from '../models/PricingPlan.js';
import { FAQ } from '../models/FAQ.js';
import { Client } from '../models/Client.js';
import { Project } from '../models/Project.js';
import { CaseStudy } from '../models/CaseStudy.js';
import { BlogCategory } from '../models/BlogCategory.js';
import { BlogPost } from '../models/BlogPost.js';
import { NavigationItem } from '../models/NavigationItem.js';
import { Page } from '../models/Page.js';
import { toSlug } from '../utils/slugify.js';

async function seedSuperAdmin() {
  const existing = await User.findOne({ email: env.SEED_ADMIN_EMAIL });
  if (existing) {
    console.log(`↷ Super Admin already exists (${env.SEED_ADMIN_EMAIL}), skipping.`);
    return;
  }
  await User.create({
    name: env.SEED_ADMIN_NAME,
    email: env.SEED_ADMIN_EMAIL,
    password: env.SEED_ADMIN_PASSWORD,
    role: 'superadmin',
  });
  console.log(`✅ Super Admin created: ${env.SEED_ADMIN_EMAIL}`);
}

async function seedSiteSettings() {
  const existing = await SiteSettings.findOne({ key: 'main' });
  if (existing) {
    console.log('↷ Site settings already exist, skipping.');
    return;
  }
  await SiteSettings.create({
    key: 'main',
    siteName: 'SpyDev',
    tagline: 'Digital Products. Engineered to Move Businesses Forward.',
    contactEmail: 'hello@spydev.agency',
    socialLinks: [
      { platform: 'LinkedIn', url: 'https://linkedin.com/company/spydev', enabled: true },
      { platform: 'GitHub', url: 'https://github.com/spydev', enabled: true },
      { platform: 'X', url: 'https://x.com/spydev', enabled: true },
    ],
  });
  console.log('✅ Site settings seeded');
}

const DEMO_SERVICES = [
  {
    title: 'Web Development',
    shortDescription: 'High-performance, scalable web applications built on modern frameworks.',
    fullDescription:
      'We design and build fast, accessible, and maintainable web applications — from marketing sites to complex internal platforms — using React, Next.js, and Node.js.',
    icon: 'code-2',
    technologies: ['React', 'Next.js', 'Node.js', 'TypeScript'],
    features: [
      { title: 'Performance-first builds', description: 'Optimized for Core Web Vitals and fast load times.', icon: 'zap' },
      { title: 'Scalable architecture', description: 'Built to grow with your product and traffic.', icon: 'layers' },
    ],
    displayOrder: 1,
  },
  {
    title: 'Mobile App Development',
    shortDescription: 'Native-feeling cross-platform apps for iOS and Android.',
    fullDescription:
      'We build cross-platform mobile applications with React Native and Flutter that feel native, ship fast, and scale with your user base.',
    icon: 'smartphone',
    technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
    features: [
      { title: 'Cross-platform efficiency', description: 'One codebase, native performance on iOS and Android.', icon: 'smartphone' },
    ],
    displayOrder: 2,
  },
  {
    title: 'AI Agents & Automation',
    shortDescription: 'Custom AI agents and automation pipelines that remove manual work.',
    fullDescription:
      'We design and deploy production-grade AI agents and automation workflows using LangChain, OpenAI, and Gemini to streamline operations and unlock new product capabilities.',
    icon: 'bot',
    technologies: ['LangChain', 'OpenAI', 'Gemini', 'Python'],
    features: [
      { title: 'Custom AI agents', description: 'Purpose-built agents for your specific workflows.', icon: 'bot' },
    ],
    displayOrder: 3,
  },
  {
    title: 'Custom Software Development',
    shortDescription: 'Bespoke software engineered around your exact business processes.',
    fullDescription:
      'From internal tools to full SaaS platforms, we design and build custom software that fits how your business actually operates.',
    icon: 'layout-grid',
    technologies: ['Node.js', 'PostgreSQL', 'Docker', 'AWS'],
    features: [],
    displayOrder: 4,
  },
  {
    title: 'Cybersecurity & Penetration Testing',
    shortDescription: 'Web application penetration testing and security audits.',
    fullDescription:
      'Our security team performs thorough web application penetration tests and security audits to identify and remediate vulnerabilities before attackers do.',
    icon: 'shield',
    technologies: ['Burp Suite', 'OWASP ZAP', 'Linux', 'Nmap'],
    features: [
      { title: 'Web app pentesting', description: 'OWASP Top 10-aligned manual and automated testing.', icon: 'shield' },
    ],
    displayOrder: 5,
  },
  {
    title: 'UI/UX Engineering',
    shortDescription: 'Interfaces engineered for clarity, speed, and conversion.',
    fullDescription:
      'We design and engineer interfaces — not just mockups — pairing product thinking with production-ready front-end implementation.',
    icon: 'palette',
    technologies: ['Figma', 'React', 'Tailwind CSS', 'Framer Motion'],
    features: [],
    displayOrder: 6,
  },
];

async function seedServices() {
  const count = await Service.countDocuments();
  if (count > 0) {
    console.log('↷ Services already exist, skipping.');
    return;
  }
  for (const svc of DEMO_SERVICES) {
    const slug = svc.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    await Service.create({ ...svc, slug, status: 'active' });
  }
  console.log(`✅ Seeded ${DEMO_SERVICES.length} services`);
}

const DEFAULT_SECTIONS: {
  type: string;
  key: string;
  order: number;
  heading?: string;
  subheading?: string;
  content?: Record<string, unknown>;
  enabled?: boolean;
}[] = [
  {
    type: 'hero',
    key: 'hero-main',
    order: 0,
    content: {
      badge: 'Available for new projects',
      headline: 'Digital Products. Engineered to Move Businesses Forward.',
      description:
        'SpyDev is a premium technology agency building web, mobile, AI, and cybersecurity solutions for companies that need serious engineering.',
      primaryCta: { text: 'Start a project', url: '/start-project' },
      secondaryCta: { text: 'View our work', url: '/projects' },
      trustIndicators: ['50+ Projects shipped', '20+ Clients served', '99% On-time delivery'],
      visualImage: 'https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&w=1200&q=80',
    },
  },
  { type: 'clients', key: 'clients-main', order: 1, heading: 'Trusted by ambitious teams' },
  { type: 'services', key: 'services-main', order: 2, heading: 'What we do', subheading: 'End-to-end technology services for serious businesses.' },
  {
    type: 'stats',
    key: 'stats-main',
    order: 3,
    content: {
      items: [
        { label: 'Projects shipped', value: 50, suffix: '+' },
        { label: 'Clients served', value: 20, suffix: '+' },
        { label: 'Technologies mastered', value: 15, suffix: '+' },
        { label: 'On-time delivery', value: 99, suffix: '%' },
      ],
    },
  },
  { type: 'projects', key: 'projects-main', order: 4, heading: 'Selected work' },
  { type: 'process', key: 'process-main', order: 5, heading: 'How we work' },
  { type: 'technologies', key: 'technologies-main', order: 6, heading: 'Our stack' },
  { type: 'testimonials', key: 'testimonials-main', order: 7, heading: 'What clients say' },
  { type: 'faq', key: 'faq-main', order: 8, heading: 'Frequently asked questions' },
  { type: 'pricing', key: 'pricing-main', order: 10, heading: 'Simple, transparent packages', enabled: false },
  {
    type: 'cta',
    key: 'cta-main',
    order: 9,
    content: {
      heading: 'Have a project in mind?',
      description: "Tell us what you're building — we'll get back to you within one business day.",
      buttonText: 'Start a project',
      buttonUrl: '/start-project',
    },
  },
];

async function seedHomepageSections() {
  const count = await HomepageSection.countDocuments();
  if (count > 0) {
    console.log('↷ Homepage sections already exist, skipping.');
    return;
  }
  await HomepageSection.insertMany(DEFAULT_SECTIONS.map((s) => ({ enabled: true, ...s })));
  console.log(`✅ Seeded ${DEFAULT_SECTIONS.length} homepage sections`);
}

const DEMO_TEAM = [
  {
    name: 'Marcus Reyes',
    position: 'Founder & Lead Engineer',
    shortBio: 'Full-stack engineer with a decade of experience shipping production software and security tooling.',
    skills: ['TypeScript', 'Node.js', 'System Design', 'Cybersecurity'],
    linkedin: 'https://linkedin.com/in/example-marcus',
    github: 'https://github.com/example-marcus',
    displayOrder: 1,
  },
  {
    name: 'Priya Nandakumar',
    position: 'AI/ML Engineer',
    shortBio: 'Builds production AI agents and automation pipelines using LangChain, OpenAI, and Gemini.',
    skills: ['Python', 'LangChain', 'OpenAI', 'Vector Databases'],
    linkedin: 'https://linkedin.com/in/example-priya',
    github: 'https://github.com/example-priya',
    displayOrder: 2,
  },
  {
    name: 'Jonah Whitfield',
    position: 'Security Engineer',
    shortBio: 'Offensive security specialist focused on web application penetration testing and audits.',
    skills: ['Burp Suite', 'OWASP', 'Network Security', 'Python'],
    linkedin: 'https://linkedin.com/in/example-jonah',
    github: 'https://github.com/example-jonah',
    displayOrder: 3,
  },
  {
    name: 'Elena Voss',
    position: 'Product Designer',
    shortBio: 'Designs and ships interfaces end-to-end, from product strategy to production-ready UI.',
    skills: ['Figma', 'Design Systems', 'UX Research'],
    linkedin: 'https://linkedin.com/in/example-elena',
    displayOrder: 4,
  },
];

async function seedTeam() {
  if ((await TeamMember.countDocuments()) > 0) return console.log('↷ Team already exists, skipping.');
  await TeamMember.insertMany(DEMO_TEAM.map((t) => ({ ...t, status: 'active' })));
  console.log(`✅ Seeded ${DEMO_TEAM.length} team members`);
}

const DEMO_TECHNOLOGIES: { name: string; category: string; displayOrder: number }[] = [
  { name: 'React', category: 'frontend', displayOrder: 1 },
  { name: 'Next.js', category: 'frontend', displayOrder: 2 },
  { name: 'TypeScript', category: 'frontend', displayOrder: 3 },
  { name: 'Tailwind CSS', category: 'frontend', displayOrder: 4 },
  { name: 'Node.js', category: 'backend', displayOrder: 5 },
  { name: 'Express', category: 'backend', displayOrder: 6 },
  { name: 'MongoDB', category: 'database', displayOrder: 7 },
  { name: 'PostgreSQL', category: 'database', displayOrder: 8 },
  { name: 'Flutter', category: 'mobile', displayOrder: 9 },
  { name: 'React Native', category: 'mobile', displayOrder: 10 },
  { name: 'Python', category: 'ai', displayOrder: 11 },
  { name: 'LangChain', category: 'ai', displayOrder: 12 },
  { name: 'OpenAI', category: 'ai', displayOrder: 13 },
  { name: 'Docker', category: 'devops', displayOrder: 14 },
  { name: 'AWS', category: 'devops', displayOrder: 15 },
  { name: 'Linux', category: 'devops', displayOrder: 16 },
  { name: 'Burp Suite', category: 'security', displayOrder: 17 },
];

async function seedTechnologies() {
  if ((await Technology.countDocuments()) > 0) return console.log('↷ Technologies already exist, skipping.');
  await Technology.insertMany(DEMO_TECHNOLOGIES.map((t) => ({ ...t, status: 'active' })));
  console.log(`✅ Seeded ${DEMO_TECHNOLOGIES.length} technologies`);
}

const DEMO_PROCESS = [
  { title: 'Discover', description: 'We learn your business, users, and constraints before writing a single line of code.', icon: 'search', displayOrder: 1 },
  { title: 'Strategize', description: 'We define scope, architecture, and success metrics for the engagement.', icon: 'compass', displayOrder: 2 },
  { title: 'Design', description: 'We design interfaces and system architecture together, not in isolation.', icon: 'palette', displayOrder: 3 },
  { title: 'Develop', description: 'We build in short, reviewable increments with continuous feedback.', icon: 'code-2', displayOrder: 4 },
  { title: 'Test', description: 'We test functionally and for security before anything ships.', icon: 'check-circle', displayOrder: 5 },
  { title: 'Deploy', description: 'We ship to production with proper CI/CD, monitoring, and rollback plans.', icon: 'rocket', displayOrder: 6 },
  { title: 'Scale', description: 'We stay engaged post-launch to help your product handle real-world growth.', icon: 'trending-up', displayOrder: 7 },
];

async function seedProcess() {
  if ((await ProcessStep.countDocuments()) > 0) return console.log('↷ Process steps already exist, skipping.');
  await ProcessStep.insertMany(DEMO_PROCESS.map((p) => ({ ...p, status: 'active' })));
  console.log(`✅ Seeded ${DEMO_PROCESS.length} process steps`);
}

const DEMO_TESTIMONIALS = [
  {
    clientName: 'Rachel Kim',
    company: 'Nova Retail Group',
    position: 'VP of Engineering',
    testimonial: 'SpyDev rebuilt our checkout platform in under three months with zero downtime during migration. Communication was excellent throughout.',
    rating: 5,
    featured: true,
    displayOrder: 1,
  },
  {
    clientName: 'David Okafor',
    company: 'Vertex Logistics',
    position: 'CTO',
    testimonial: 'The security audit SpyDev ran found issues our previous vendor missed entirely. Genuinely thorough, technical work.',
    rating: 5,
    featured: true,
    displayOrder: 2,
  },
  {
    clientName: 'Sofia Marchetti',
    company: 'Lumen Health',
    position: 'Head of Product',
    testimonial: 'They shipped our AI intake agent faster than we expected, and it has handled thousands of conversations without issue.',
    rating: 5,
    featured: false,
    displayOrder: 3,
  },
];

async function seedTestimonials() {
  if ((await Testimonial.countDocuments()) > 0) return console.log('↷ Testimonials already exist, skipping.');
  await Testimonial.insertMany(DEMO_TESTIMONIALS.map((t) => ({ ...t, status: 'active' })));
  console.log(`✅ Seeded ${DEMO_TESTIMONIALS.length} testimonials`);
}

const DEMO_PRICING = [
  {
    name: 'Starter',
    price: '$4,999',
    billingPeriod: 'one-time',
    description: 'For a single, well-scoped feature or MVP.',
    features: ['Up to 4 weeks of engineering', 'One engineer assigned', 'Basic QA pass', '30 days post-launch support'],
    isPopular: false,
    displayOrder: 1,
  },
  {
    name: 'Growth',
    price: '$14,999',
    billingPeriod: 'one-time',
    description: 'For a full product build or major feature set.',
    features: ['Up to 10 weeks of engineering', 'Dedicated 2-person team', 'Security review included', '90 days post-launch support'],
    isPopular: true,
    displayOrder: 2,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    billingPeriod: 'engagement',
    description: 'For ongoing product development or complex systems.',
    features: ['Dedicated team, flexible scope', 'Architecture & security ownership', 'SLA-backed support', 'Quarterly roadmap planning'],
    isPopular: false,
    displayOrder: 3,
  },
];

async function seedPricing() {
  if ((await PricingPlan.countDocuments()) > 0) return console.log('↷ Pricing plans already exist, skipping.');
  await PricingPlan.insertMany(DEMO_PRICING.map((p) => ({ ...p, ctaText: 'Get started', ctaUrl: '/start-project', status: 'active' })));
  console.log(`✅ Seeded ${DEMO_PRICING.length} pricing plans`);
}

const DEMO_FAQS = [
  { question: 'How long does a typical project take?', answer: 'Most engagements run 4–12 weeks depending on scope. We scope every project up front so timelines are clear before work begins.', category: 'Process', displayOrder: 1 },
  { question: 'Do you work with early-stage startups?', answer: 'Yes — we work with both early-stage startups and established companies, and scope engagements to fit your stage and budget.', category: 'General', displayOrder: 2 },
  { question: 'Can you take over an existing codebase?', answer: 'Yes. We regularly take over existing projects, starting with a technical and security audit before proposing next steps.', category: 'Process', displayOrder: 3 },
  { question: 'Do you offer ongoing support after launch?', answer: 'Every engagement includes a post-launch support window, and we offer ongoing retainers for continued development.', category: 'Support', displayOrder: 4 },
  { question: 'What industries do you have security experience in?', answer: 'Our security team has performed penetration tests and audits across fintech, healthcare, e-commerce, and SaaS platforms.', category: 'Security', displayOrder: 5 },
];

async function seedFaqs() {
  if ((await FAQ.countDocuments()) > 0) return console.log('↷ FAQs already exist, skipping.');
  await FAQ.insertMany(DEMO_FAQS.map((f) => ({ ...f, status: 'active' })));
  console.log(`✅ Seeded ${DEMO_FAQS.length} FAQs`);
}

const DEMO_CLIENTS = [
  { name: 'Nova Retail Group', logoUrl: 'https://dummyimage.com/160x48/e5e7eb/6b7280&text=Nova+Retail', displayOrder: 1 },
  { name: 'Vertex Logistics', logoUrl: 'https://dummyimage.com/160x48/e5e7eb/6b7280&text=Vertex', displayOrder: 2 },
  { name: 'Lumen Health', logoUrl: 'https://dummyimage.com/160x48/e5e7eb/6b7280&text=Lumen+Health', displayOrder: 3 },
  { name: 'Northbound Finance', logoUrl: 'https://dummyimage.com/160x48/e5e7eb/6b7280&text=Northbound', displayOrder: 4 },
  { name: 'Cedar & Co', logoUrl: 'https://dummyimage.com/160x48/e5e7eb/6b7280&text=Cedar+%26+Co', displayOrder: 5 },
];

async function seedClients() {
  if ((await Client.countDocuments()) > 0) return console.log('↷ Clients already exist, skipping.');
  await Client.insertMany(DEMO_CLIENTS.map((c) => ({ ...c, status: 'active' })));
  console.log(`✅ Seeded ${DEMO_CLIENTS.length} clients`);
}

const DEMO_PROJECTS = [
  {
    name: 'Nova Retail Checkout Platform',
    client: 'Nova Retail Group',
    category: 'ecommerce',
    description: 'A rebuilt checkout and payments platform handling six figures in monthly transaction volume.',
    challenge: 'Their legacy checkout had a 40% cart abandonment rate and frequent payment failures at peak traffic.',
    solution: 'We rebuilt the checkout flow on Next.js with a resilient payment orchestration layer and optimistic UI.',
    results: 'Cart abandonment dropped to 18% and payment failure rate fell by 90% within the first month.',
    technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe'],
    featured: true,
    displayOrder: 1,
  },
  {
    name: 'Vertex Fleet Tracking App',
    client: 'Vertex Logistics',
    category: 'mobile',
    description: 'A cross-platform mobile app for real-time fleet tracking and driver communication.',
    challenge: 'Dispatchers had no real-time visibility into fleet location or driver status.',
    solution: 'We built a React Native app with live location tracking and push-based dispatch messaging.',
    results: 'Dispatch response time improved by 35%, and driver check-in compliance reached 98%.',
    technologies: ['React Native', 'Node.js', 'MongoDB', 'WebSockets'],
    featured: true,
    displayOrder: 2,
  },
  {
    name: 'Lumen Health Intake Agent',
    client: 'Lumen Health',
    category: 'ai',
    description: 'An AI-powered patient intake agent that pre-screens and routes incoming inquiries.',
    challenge: 'Front-desk staff were spending hours a day on repetitive intake questions.',
    solution: 'We built a LangChain-based agent integrated with their scheduling system to automate intake end-to-end.',
    results: 'Automated 70% of intake conversations, freeing up over 20 staff-hours per week.',
    technologies: ['Python', 'LangChain', 'OpenAI', 'PostgreSQL'],
    featured: true,
    displayOrder: 3,
  },
  {
    name: 'Northbound Finance Security Audit',
    client: 'Northbound Finance',
    category: 'cybersecurity',
    description: 'A full web application penetration test and remediation engagement for a fintech platform.',
    challenge: 'Ahead of a compliance review, they needed an independent security assessment of their platform.',
    solution: 'Our security team ran a manual and automated penetration test aligned to the OWASP Top 10, then supported remediation.',
    results: 'Identified and remediated 14 vulnerabilities, including two critical issues, ahead of their compliance deadline.',
    technologies: ['Burp Suite', 'OWASP ZAP', 'Nmap'],
    featured: false,
    displayOrder: 4,
  },
];

async function seedProjects() {
  if ((await Project.countDocuments()) > 0) return console.log('↷ Projects already exist, skipping.');
  for (const p of DEMO_PROJECTS) {
    await Project.create({ ...p, slug: toSlug(p.name), status: 'active' });
  }
  console.log(`✅ Seeded ${DEMO_PROJECTS.length} projects`);
}

async function seedCaseStudies() {
  if ((await CaseStudy.countDocuments()) > 0) return console.log('↷ Case studies already exist, skipping.');
  const relatedProject = await Project.findOne({ slug: toSlug('Nova Retail Checkout Platform') });

  await CaseStudy.create({
    title: 'How Nova Retail Cut Cart Abandonment by 55%',
    slug: toSlug('How Nova Retail Cut Cart Abandonment by 55%'),
    client: 'Nova Retail Group',
    problem: 'Nova Retail was losing an estimated $2M in annual revenue to checkout abandonment and payment failures.',
    strategy: 'We prioritized a full checkout rebuild over incremental fixes, given the scale of the underlying architectural issues.',
    solution: 'We rebuilt the checkout on Next.js with a resilient payment orchestration layer, added optimistic UI, and instrumented every step for observability.',
    implementation: 'Delivered in three two-week sprints, with feature-flagged rollout to 10%, 50%, then 100% of traffic.',
    technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe'],
    results: 'Cart abandonment fell from 40% to 18%, and payment failure rate dropped by 90% within the first month post-launch.',
    metrics: [
      { label: 'Cart abandonment', value: '-55%' },
      { label: 'Payment failures', value: '-90%' },
      { label: 'Checkout time', value: '-40%' },
    ],
    timeline: [
      { phase: 'Discovery & audit', description: 'Two weeks assessing the existing checkout and identifying failure points.' },
      { phase: 'Rebuild', description: 'Six weeks rebuilding the checkout flow and payment orchestration layer.' },
      { phase: 'Rollout', description: 'Two weeks of phased rollout with real-time monitoring.' },
    ],
    testimonialQuote: 'SpyDev rebuilt our checkout platform in under three months with zero downtime during migration.',
    testimonialAuthor: 'Rachel Kim',
    testimonialPosition: 'VP of Engineering, Nova Retail Group',
    relatedProject: relatedProject?._id,
    status: 'active',
    displayOrder: 1,
  });
  console.log('✅ Seeded 1 case study');
}

async function seedBlog() {
  if ((await BlogCategory.countDocuments()) > 0) return console.log('↷ Blog categories already exist, skipping.');

  const categories = await BlogCategory.insertMany([
    { name: 'Engineering', slug: toSlug('Engineering'), displayOrder: 1, status: 'active' },
    { name: 'AI', slug: toSlug('AI'), displayOrder: 2, status: 'active' },
    { name: 'Security', slug: toSlug('Security'), displayOrder: 3, status: 'active' },
  ]);

  const admin = await User.findOne({ email: env.SEED_ADMIN_EMAIL });

  const posts = [
    {
      title: 'Why We Rebuild Checkout Flows on Next.js in 2026',
      category: categories[0]._id,
      excerpt: 'A look at the architectural patterns we reach for when rebuilding high-traffic checkout experiences.',
      content: '<p>When we rebuild a checkout flow, we start with the payment orchestration layer, not the UI.</p><h2>Why architecture first</h2><p>Most checkout failures we see are not visual — they are architectural: retry logic, idempotency, and state management under load.</p>',
      tags: ['Next.js', 'E-commerce', 'Architecture'],
    },
    {
      title: 'Building Production AI Agents That Actually Ship',
      category: categories[1]._id,
      excerpt: 'The difference between a demo agent and one that survives real production traffic.',
      content: '<p>Most AI agent demos fall apart in production. Here is what we do differently.</p><h2>Guardrails first</h2><p>Every production agent we ship has explicit guardrails, fallback paths, and human escalation built in from day one.</p>',
      tags: ['AI', 'LangChain', 'Production'],
    },
    {
      title: 'Five Things We Check First in Every Penetration Test',
      category: categories[2]._id,
      excerpt: 'Common vulnerability classes our security team finds most often — and how to avoid them.',
      content: '<p>Across dozens of engagements, a handful of vulnerability classes show up again and again.</p><h2>1. Broken access control</h2><p>Still the most common critical finding across the applications we test.</p>',
      tags: ['Security', 'OWASP', 'Pentesting'],
    },
  ];

  for (const [i, post] of posts.entries()) {
    const daysAgo = (posts.length - i) * 7;
    await BlogPost.create({
      ...post,
      slug: toSlug(post.title),
      author: admin?._id,
      status: 'published',
      publishedAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
    });
  }
  console.log(`✅ Seeded ${categories.length} blog categories and ${posts.length} blog posts`);
}

const DEMO_NAV = [
  { label: 'Services', url: '/services', location: 'header', displayOrder: 1 },
  { label: 'Projects', url: '/projects', location: 'header', displayOrder: 2 },
  { label: 'About', url: '/about', location: 'header', displayOrder: 3 },
  { label: 'Blog', url: '/blog', location: 'header', displayOrder: 4 },
  { label: 'Contact', url: '/contact', location: 'header', displayOrder: 5 },
];

async function seedNavigation() {
  if ((await NavigationItem.countDocuments()) > 0) return console.log('↷ Navigation already exists, skipping.');
  await NavigationItem.insertMany(DEMO_NAV.map((n) => ({ ...n, status: 'active' })));
  console.log(`✅ Seeded ${DEMO_NAV.length} navigation items`);
}

const DEMO_PAGES = [
  {
    slug: 'about',
    title: 'About SpyDev',
    content:
      '<p>SpyDev is a premium technology agency building web, mobile, AI, and cybersecurity solutions for businesses that need serious engineering.</p>' +
      '<h2>Our mission</h2><p>We exist to give ambitious companies the same caliber of engineering talent normally reserved for venture-backed product teams.</p>' +
      '<h2>Our values</h2><p>Technical honesty, security by default, and shipping software that actually works in production — not just in a demo.</p>',
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    content:
      '<p>This Privacy Policy describes how SpyDev ("we", "us") collects, uses, and protects information submitted through this website.</p>' +
      '<h2>Information we collect</h2><p>We collect information you voluntarily submit through our contact and project inquiry forms, including your name, email, and project details.</p>' +
      '<h2>How we use it</h2><p>We use this information solely to respond to your inquiry and, if applicable, deliver services you have requested.</p>' +
      '<p><em>Replace this placeholder text with your reviewed privacy policy before launch.</em></p>',
  },
  {
    slug: 'terms',
    title: 'Terms of Service',
    content:
      '<p>These Terms of Service govern your use of the SpyDev website.</p>' +
      '<h2>Use of this site</h2><p>This website is provided for informational purposes. Engagement in paid services is governed by a separate signed agreement.</p>' +
      '<p><em>Replace this placeholder text with your reviewed terms of service before launch.</em></p>',
  },
];

async function seedPages() {
  if ((await Page.countDocuments()) > 0) return console.log('↷ Pages already exist, skipping.');
  await Page.insertMany(DEMO_PAGES.map((p) => ({ ...p, status: 'active' })));
  console.log(`✅ Seeded ${DEMO_PAGES.length} pages`);
}

async function run() {
  console.log('🌱 Seeding SpyDev database...\n');
  await connectDB();

  await seedSuperAdmin();
  await seedSiteSettings();
  await seedServices();
  await seedHomepageSections();
  await seedTeam();
  await seedTechnologies();
  await seedProcess();
  await seedTestimonials();
  await seedPricing();
  await seedFaqs();
  await seedClients();
  await seedProjects();
  await seedCaseStudies();
  await seedBlog();
  await seedNavigation();
  await seedPages();

  console.log('\n🌱 Seed complete.');
  await disconnectDB();
  process.exit(0);
}

run().catch(async (err) => {
  console.error('❌ Seed failed:', err);
  await disconnectDB().catch(() => undefined);
  process.exit(1);
});
