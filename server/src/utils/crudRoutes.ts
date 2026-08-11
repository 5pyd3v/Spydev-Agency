import { Router } from 'express';
import type { ZodSchema } from 'zod';
import { protect, authorize, csrfProtect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { reorderSchema } from '../validators/common.validator.js';
import type { createCrudController } from './crudFactory.js';
import type { UserRole } from '../models/User.js';

interface CrudRouteOptions {
  controller: ReturnType<typeof createCrudController>;
  createSchema: ZodSchema;
  updateSchema: ZodSchema;
  /** Roles allowed to create/update/reorder. Defaults to superadmin/admin/editor. */
  writeRoles?: UserRole[];
  /** Roles allowed to delete. Defaults to superadmin/admin. */
  deleteRoles?: UserRole[];
  /** Mount the public `GET /:slug` detail route (only for resources that have a slug). */
  withPublicDetail?: boolean;
}

const DEFAULT_WRITE_ROLES: UserRole[] = ['superadmin', 'admin', 'editor'];
const DEFAULT_DELETE_ROLES: UserRole[] = ['superadmin', 'admin'];

/**
 * Wires the conventional route set shared by every simple content resource:
 * public list (+ optional slug detail), admin list/get, create/update/reorder,
 * and delete — matching the pattern established by `createCrudController`.
 */
export function buildCrudRouter({
  controller,
  createSchema,
  updateSchema,
  writeRoles = DEFAULT_WRITE_ROLES,
  deleteRoles = DEFAULT_DELETE_ROLES,
  withPublicDetail = false,
}: CrudRouteOptions): Router {
  const router = Router();

  router.get('/', controller.listPublic);
  if (withPublicDetail) router.get('/:slug', controller.getPublicBySlug);

  router.get('/admin/all', protect, authorize(...DEFAULT_WRITE_ROLES), controller.listAdmin);
  router.get('/admin/:id', protect, authorize(...DEFAULT_WRITE_ROLES), controller.getById);

  router.post('/', protect, authorize(...writeRoles), csrfProtect, validate(createSchema), controller.create);
  router.put('/:id', protect, authorize(...writeRoles), csrfProtect, validate(updateSchema), controller.update);
  router.patch(
    '/reorder',
    protect,
    authorize(...writeRoles),
    csrfProtect,
    validate(reorderSchema),
    controller.reorder
  );
  router.delete('/:id', protect, authorize(...deleteRoles), csrfProtect, controller.remove);

  return router;
}
