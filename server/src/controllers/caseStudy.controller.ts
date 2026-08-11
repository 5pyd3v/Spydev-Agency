import { CaseStudy } from '../models/CaseStudy.js';
import { createCrudController } from '../utils/crudFactory.js';

export const caseStudyController = createCrudController(CaseStudy, {
  resourceName: 'Case study',
  searchFields: ['title', 'client'],
  publicFilter: { status: 'active' },
  slugSource: 'title',
  populate: 'relatedProject',
});
