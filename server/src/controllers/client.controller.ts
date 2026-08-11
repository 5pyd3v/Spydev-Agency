import { Client } from '../models/Client.js';
import { createCrudController } from '../utils/crudFactory.js';

export const clientController = createCrudController(Client, {
  resourceName: 'Client',
  searchFields: ['name'],
  publicFilter: { status: 'active' },
});
