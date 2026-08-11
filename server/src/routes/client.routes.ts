import { clientController } from '../controllers/client.controller.js';
import { createClientSchema, updateClientSchema } from '../validators/client.validator.js';
import { buildCrudRouter } from '../utils/crudRoutes.js';

export default buildCrudRouter({
  controller: clientController,
  createSchema: createClientSchema,
  updateSchema: updateClientSchema,
});
