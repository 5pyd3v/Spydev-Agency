import { pricingPlanController } from '../controllers/pricingPlan.controller.js';
import { createPricingPlanSchema, updatePricingPlanSchema } from '../validators/pricingPlan.validator.js';
import { buildCrudRouter } from '../utils/crudRoutes.js';

export default buildCrudRouter({
  controller: pricingPlanController,
  createSchema: createPricingPlanSchema,
  updateSchema: updatePricingPlanSchema,
});
