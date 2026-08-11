import { technologyController } from '../controllers/technology.controller.js';
import { createTechnologySchema, updateTechnologySchema } from '../validators/technology.validator.js';
import { buildCrudRouter } from '../utils/crudRoutes.js';

export default buildCrudRouter({
  controller: technologyController,
  createSchema: createTechnologySchema,
  updateSchema: updateTechnologySchema,
});
