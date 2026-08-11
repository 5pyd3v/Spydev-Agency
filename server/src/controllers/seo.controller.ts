import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Service } from '../models/Service.js';
import { Project } from '../models/Project.js';
import { CaseStudy } from '../models/CaseStudy.js';
import { BlogPost } from '../models/BlogPost.js';
import { env } from '../config/env.js';

const STATIC_ROUTES = [
  '', 'services', 'projects', 'case-studies', 'about', 'team', 'blog', 'contact', 'start-project',
  'privacy-policy', 'terms',
];

function siteUrl(): string {
  return env.CLIENT_URL.replace(/\/$/, '');
}

function urlEntry(loc: string, updatedAt?: Date) {
  return `  <url>\n    <loc>${loc}</loc>\n${updatedAt ? `    <lastmod>${updatedAt.toISOString()}</lastmod>\n` : ''}  </url>`;
}

export const getSitemap = asyncHandler(async (_req: Request, res: Response) => {
  const base = siteUrl();

  const [services, projects, caseStudies, posts] = await Promise.all([
    Service.find({ status: 'active' }).select('slug updatedAt'),
    Project.find({ status: 'active' }).select('slug updatedAt'),
    CaseStudy.find({ status: 'active' }).select('slug updatedAt'),
    BlogPost.find({ status: 'published', publishedAt: { $lte: new Date() } }).select('slug updatedAt'),
  ]);

  const entries = [
    ...STATIC_ROUTES.map((route) => urlEntry(`${base}/${route}`)),
    ...services.map((s) => urlEntry(`${base}/services/${s.slug}`, s.updatedAt)),
    ...projects.map((p) => urlEntry(`${base}/projects/${p.slug}`, p.updatedAt)),
    ...caseStudies.map((c) => urlEntry(`${base}/case-studies/${c.slug}`, c.updatedAt)),
    ...posts.map((p) => urlEntry(`${base}/blog/${p.slug}`, p.updatedAt)),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>`;

  res.type('application/xml').send(xml);
});

export const getRobotsTxt = asyncHandler(async (_req: Request, res: Response) => {
  const base = siteUrl();
  const body = `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${base}/sitemap.xml\n`;
  res.type('text/plain').send(body);
});
