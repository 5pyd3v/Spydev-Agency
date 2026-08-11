import { Router } from 'express';
import {
  createPost,
  deletePost,
  getAdminPost,
  getPublicPostBySlug,
  listAdminPosts,
  listPublicPosts,
  updatePost,
} from '../controllers/blogPost.controller.js';
import { protect, authorize, csrfProtect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createBlogPostSchema, updateBlogPostSchema } from '../validators/blogPost.validator.js';

const router = Router();
const WRITE_ROLES = ['superadmin', 'admin', 'editor'] as const;

router.get('/', listPublicPosts);
router.get('/:slug', getPublicPostBySlug);

router.get('/admin/all', protect, authorize(...WRITE_ROLES), listAdminPosts);
router.get('/admin/:id', protect, authorize(...WRITE_ROLES), getAdminPost);
router.post('/', protect, authorize(...WRITE_ROLES), csrfProtect, validate(createBlogPostSchema), createPost);
router.put('/:id', protect, authorize(...WRITE_ROLES), csrfProtect, validate(updateBlogPostSchema), updatePost);
router.delete('/:id', protect, authorize('superadmin', 'admin'), csrfProtect, deletePost);

export default router;
