import { Service } from '../models/Service.js';
import { createCrudController } from '../utils/crudFactory.js';

export const serviceController = createCrudController(Service, {
  resourceName: 'Service',
  searchFields: ['title', 'shortDescription'],
  publicFilter: { status: 'active' },
  publicSort: { displayOrder: 1 },
  slugSource: 'title',
});
