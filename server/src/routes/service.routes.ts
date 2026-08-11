import { serviceController } from '../controllers/service.controller.js';
import { createServiceSchema, updateServiceSchema } from '../validators/service.validator.js';
import { buildCrudRouter } from '../utils/crudRoutes.js';

export default buildCrudRouter({
  controller: serviceController,
  createSchema: createServiceSchema,
  updateSchema: updateServiceSchema,
  withPublicDetail: true,
});
