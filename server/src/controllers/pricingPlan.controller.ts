import { PricingPlan } from '../models/PricingPlan.js';
import { createCrudController } from '../utils/crudFactory.js';

export const pricingPlanController = createCrudController(PricingPlan, {
  resourceName: 'Pricing plan',
  searchFields: ['name'],
  publicFilter: { status: 'active' },
});
