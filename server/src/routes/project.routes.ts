import { projectController } from '../controllers/project.controller.js';
import { createProjectSchema, updateProjectSchema } from '../validators/project.validator.js';
import { buildCrudRouter } from '../utils/crudRoutes.js';

export default buildCrudRouter({
  controller: projectController,
  createSchema: createProjectSchema,
  updateSchema: updateProjectSchema,
  withPublicDetail: true,
});
