import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import morgan from 'morgan';
import { env, isDev } from './config/env.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import serviceRoutes from './routes/service.routes.js';
import homepageSectionRoutes from './routes/homepageSection.routes.js';
import mediaRoutes from './routes/media.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import teamMemberRoutes from './routes/teamMember.routes.js';
import technologyRoutes from './routes/technology.routes.js';
import processStepRoutes from './routes/processStep.routes.js';
import testimonialRoutes from './routes/testimonial.routes.js';
import pricingPlanRoutes from './routes/pricingPlan.routes.js';
import faqRoutes from './routes/faq.routes.js';
import clientRoutes from './routes/client.routes.js';
import projectRoutes from './routes/project.routes.js';
import caseStudyRoutes from './routes/caseStudy.routes.js';
import blogCategoryRoutes from './routes/blogCategory.routes.js';
import blogPostRoutes from './routes/blogPost.routes.js';
import leadRoutes from './routes/lead.routes.js';
import navigationRoutes from './routes/navigation.routes.js';
import pageRoutes from './routes/page.routes.js';
import { getRobotsTxt, getSitemap } from './controllers/seo.controller.js';

export function createApp(): Express {
  const app = express();

  app.set('trust proxy', 1);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    })
  );

  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));
  app.use(cookieParser());
  app.use(mongoSanitize());
  app.use(hpp());

  if (isDev) app.use(morgan('dev'));

  app.use('/api', globalLimiter);

  app.get('/api/health', (_req, res) => {
    res.json({ success: true, message: 'SpyDev API is running', timestamp: new Date().toISOString() });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/homepage-sections', homepageSectionRoutes);
  app.use('/api/media', mediaRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/team', teamMemberRoutes);
  app.use('/api/technologies', technologyRoutes);
  app.use('/api/process', processStepRoutes);
  app.use('/api/testimonials', testimonialRoutes);
  app.use('/api/pricing', pricingPlanRoutes);
  app.use('/api/faqs', faqRoutes);
  app.use('/api/clients', clientRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/case-studies', caseStudyRoutes);
  app.use('/api/blog/categories', blogCategoryRoutes);
  app.use('/api/blog/posts', blogPostRoutes);
  app.use('/api/leads', leadRoutes);
  app.use('/api/navigation', navigationRoutes);
  app.use('/api/pages', pageRoutes);
  app.get('/sitemap.xml', getSitemap);
  app.get('/robots.txt', getRobotsTxt);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
