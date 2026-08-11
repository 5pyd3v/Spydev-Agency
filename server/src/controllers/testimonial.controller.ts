import { Testimonial } from '../models/Testimonial.js';
import { createCrudController } from '../utils/crudFactory.js';

export const testimonialController = createCrudController(Testimonial, {
  resourceName: 'Testimonial',
  searchFields: ['clientName', 'company'],
  publicFilter: { status: 'active' },
});
