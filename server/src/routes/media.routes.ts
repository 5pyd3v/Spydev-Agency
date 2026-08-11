import { Router } from 'express';
import { deleteMedia, listMedia, updateMedia, uploadMedia } from '../controllers/media.controller.js';
import { protect, authorize, csrfProtect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.use(protect, authorize('superadmin', 'admin', 'editor'));

router.get('/', listMedia);
router.post('/upload', csrfProtect, upload.array('files', 10), uploadMedia);
router.put('/:id', csrfProtect, updateMedia);
router.delete('/:id', authorize('superadmin', 'admin'), csrfProtect, deleteMedia);

export default router;
