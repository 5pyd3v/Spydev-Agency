import { TeamMember } from '../models/TeamMember.js';
import { createCrudController } from '../utils/crudFactory.js';

export const teamMemberController = createCrudController(TeamMember, {
  resourceName: 'Team member',
  searchFields: ['name', 'position'],
  publicFilter: { status: 'active' },
});
