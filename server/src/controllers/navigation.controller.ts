import { NavigationItem } from '../models/NavigationItem.js';
import { createCrudController } from '../utils/crudFactory.js';

export const navigationController = createCrudController(NavigationItem, {
  resourceName: 'Navigation item',
  searchFields: ['label'],
  publicFilter: { status: 'active' },
  populate: 'parent',
});
