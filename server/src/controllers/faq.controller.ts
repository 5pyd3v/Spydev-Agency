import { FAQ } from '../models/FAQ.js';
import { createCrudController } from '../utils/crudFactory.js';

export const faqController = createCrudController(FAQ, {
  resourceName: 'FAQ',
  searchFields: ['question', 'category'],
  publicFilter: { status: 'active' },
});
