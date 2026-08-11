import { ProcessStep } from '../models/ProcessStep.js';
import { createCrudController } from '../utils/crudFactory.js';

export const processStepController = createCrudController(ProcessStep, {
  resourceName: 'Process step',
  searchFields: ['title'],
  publicFilter: { status: 'active' },
});
