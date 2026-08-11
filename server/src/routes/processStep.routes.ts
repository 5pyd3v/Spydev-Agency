import { processStepController } from '../controllers/processStep.controller.js';
import { createProcessStepSchema, updateProcessStepSchema } from '../validators/processStep.validator.js';
import { buildCrudRouter } from '../utils/crudRoutes.js';

export default buildCrudRouter({
  controller: processStepController,
  createSchema: createProcessStepSchema,
  updateSchema: updateProcessStepSchema,
});
