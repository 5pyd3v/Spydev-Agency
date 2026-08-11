import { BlogCategory } from '../models/BlogCategory.js';
import { createCrudController } from '../utils/crudFactory.js';

export const blogCategoryController = createCrudController(BlogCategory, {
  resourceName: 'Blog category',
  searchFields: ['name'],
  publicFilter: { status: 'active' },
  slugSource: 'name',
});
