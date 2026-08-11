import { faqController } from '../controllers/faq.controller.js';
import { createFaqSchema, updateFaqSchema } from '../validators/faq.validator.js';
import { buildCrudRouter } from '../utils/crudRoutes.js';

export default buildCrudRouter({
  controller: faqController,
  createSchema: createFaqSchema,
  updateSchema: updateFaqSchema,
});
