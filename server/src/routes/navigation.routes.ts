import { z } from 'zod';
import { navigationController } from '../controllers/navigation.controller.js';
import { buildCrudRouter } from '../utils/crudRoutes.js';

const createNavigationSchema = z.object({
  label: z.string().min(1).max(60),
  url: z.string().min(1),
  location: z.enum(['header', 'footer']).optional(),
  parent: z.string().nullable().optional(),
  openInNewTab: z.boolean().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  displayOrder: z.number().optional(),
});
const updateNavigationSchema = createNavigationSchema.partial();

export default buildCrudRouter({
  controller: navigationController,
  createSchema: createNavigationSchema,
  updateSchema: updateNavigationSchema,
});
