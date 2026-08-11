import { testimonialController } from '../controllers/testimonial.controller.js';
import { createTestimonialSchema, updateTestimonialSchema } from '../validators/testimonial.validator.js';
import { buildCrudRouter } from '../utils/crudRoutes.js';

export default buildCrudRouter({
  controller: testimonialController,
  createSchema: createTestimonialSchema,
  updateSchema: updateTestimonialSchema,
});
