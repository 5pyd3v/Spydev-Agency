import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/stats', protect, authorize('superadmin', 'admin', 'editor'), getDashboardStats);

export default router;
