import { caseStudyController } from '../controllers/caseStudy.controller.js';
import { createCaseStudySchema, updateCaseStudySchema } from '../validators/caseStudy.validator.js';
import { buildCrudRouter } from '../utils/crudRoutes.js';

export default buildCrudRouter({
  controller: caseStudyController,
  createSchema: createCaseStudySchema,
  updateSchema: updateCaseStudySchema,
  withPublicDetail: true,
});
