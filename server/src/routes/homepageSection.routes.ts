import { Router } from 'express';
import {
  createSection,
  deleteSection,
  listAllSections,
  listPublicSections,
  reorderSections,
  updateSection,
} from '../controllers/homepageSection.controller.js';
import { protect, authorize, csrfProtect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createSectionSchema,
  reorderSectionsSchema,
  updateSectionSchema,
} from '../validators/homepageSection.validator.js';

const router = Router();

router.get('/', listPublicSections);

router.get('/admin/all', protect, authorize('superadmin', 'admin', 'editor'), listAllSections);
router.post(
  '/',
  protect,
  authorize('superadmin', 'admin'),
  csrfProtect,
  validate(createSectionSchema),
  createSection
);
router.put(
  '/:id',
  protect,
  authorize('superadmin', 'admin', 'editor'),
  csrfProtect,
  validate(updateSectionSchema),
  updateSection
);
router.patch(
  '/reorder',
  protect,
  authorize('superadmin', 'admin'),
  csrfProtect,
  validate(reorderSectionsSchema),
  reorderSections
);
router.delete('/:id', protect, authorize('superadmin', 'admin'), csrfProtect, deleteSection);

export default router;
