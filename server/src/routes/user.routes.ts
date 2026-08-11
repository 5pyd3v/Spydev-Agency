import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getUser,
  listUsers,
  resetUserPassword,
  updateUser,
} from '../controllers/user.controller.js';
import { protect, authorize, csrfProtect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createUserSchema, resetUserPasswordSchema, updateUserSchema } from '../validators/user.validator.js';

const router = Router();

router.use(protect, authorize('superadmin'));

router.get('/', listUsers);
router.get('/:id', getUser);
router.post('/', csrfProtect, validate(createUserSchema), createUser);
router.put('/:id', csrfProtect, validate(updateUserSchema), updateUser);
router.delete('/:id', csrfProtect, deleteUser);
router.put('/:id/reset-password', csrfProtect, validate(resetUserPasswordSchema), resetUserPassword);

export default router;
