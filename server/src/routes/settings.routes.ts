import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller.js';
import { protect, authorize, csrfProtect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateSettingsSchema } from '../validators/settings.validator.js';

const router = Router();

router.get('/', getSettings);
router.put(
  '/',
  protect,
  authorize('superadmin', 'admin'),
  csrfProtect,
  validate(updateSettingsSchema),
  updateSettings
);

export default router;
