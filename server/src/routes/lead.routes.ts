import { Router } from 'express';
import {
  addLeadNote,
  deleteLead,
  getLead,
  listLeads,
  submitContactLead,
  submitProjectInquiry,
  updateLead,
} from '../controllers/lead.controller.js';
import { protect, authorize, csrfProtect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { leadLimiter } from '../middleware/rateLimiter.js';
import { addLeadNoteSchema, contactLeadSchema, projectInquirySchema, updateLeadSchema } from '../validators/lead.validator.js';

const router = Router();
const ADMIN_ROLES = ['superadmin', 'admin', 'editor'] as const;

router.post('/contact', leadLimiter, validate(contactLeadSchema), submitContactLead);
router.post('/start-project', leadLimiter, validate(projectInquirySchema), submitProjectInquiry);

router.get('/', protect, authorize(...ADMIN_ROLES), listLeads);
router.get('/:id', protect, authorize(...ADMIN_ROLES), getLead);
router.put('/:id', protect, authorize(...ADMIN_ROLES), csrfProtect, validate(updateLeadSchema), updateLead);
router.post('/:id/notes', protect, authorize(...ADMIN_ROLES), csrfProtect, validate(addLeadNoteSchema), addLeadNote);
router.delete('/:id', protect, authorize('superadmin', 'admin'), csrfProtect, deleteLead);

export default router;
