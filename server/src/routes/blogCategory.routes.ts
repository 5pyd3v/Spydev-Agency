import { blogCategoryController } from '../controllers/blogCategory.controller.js';
import { z } from 'zod';
import { buildCrudRouter } from '../utils/crudRoutes.js';

const createBlogCategorySchema = z.object({
  name: z.string().min(1).max(80),
  slug: z.string().trim().toLowerCase().optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  displayOrder: z.number().optional(),
});
const updateBlogCategorySchema = createBlogCategorySchema.partial();

export default buildCrudRouter({
  controller: blogCategoryController,
  createSchema: createBlogCategorySchema,
  updateSchema: updateBlogCategorySchema,
});
