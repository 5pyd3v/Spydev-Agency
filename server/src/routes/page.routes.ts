import { Router } from 'express';
import { z } from 'zod';
import { getAdminPage, getPublicPage, listPages, upsertPage } from '../controllers/page.controller.js';
import { protect, authorize, csrfProtect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();
const WRITE_ROLES = ['superadmin', 'admin', 'editor'] as const;

const upsertPageSchema = z.object({
  title: z.string().min(1).max(150),
  content: z.string().optional(),
  status: z.enum(['active', 'draft']).optional(),
  seo: z
    .object({
      title: z.string().max(70).optional(),
      description: z.string().max(200).optional(),
    })
    .partial()
    .optional(),
});

router.get('/:slug', getPublicPage);

router.get('/admin/all', protect, authorize(...WRITE_ROLES), listPages);
router.get('/admin/:slug', protect, authorize(...WRITE_ROLES), getAdminPage);
router.put('/admin/:slug', protect, authorize(...WRITE_ROLES), csrfProtect, validate(upsertPageSchema), upsertPage);

export default router;
