import { Technology } from '../models/Technology.js';
import { createCrudController } from '../utils/crudFactory.js';

export const technologyController = createCrudController(Technology, {
  resourceName: 'Technology',
  searchFields: ['name'],
  publicFilter: { status: 'active' },
});
