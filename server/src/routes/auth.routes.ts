import { Router } from 'express';
import { changePassword, login, logout, me, refresh } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { changePasswordSchema, loginSchema } from '../validators/auth.validator.js';
import { protect, csrfProtect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/logout', protect, csrfProtect, logout);
router.get('/me', protect, me);
router.post('/refresh', authLimiter, refresh);
router.put('/change-password', protect, csrfProtect, validate(changePasswordSchema), changePassword);

export default router;
