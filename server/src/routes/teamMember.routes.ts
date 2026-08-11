import { teamMemberController } from '../controllers/teamMember.controller.js';
import { createTeamMemberSchema, updateTeamMemberSchema } from '../validators/teamMember.validator.js';
import { buildCrudRouter } from '../utils/crudRoutes.js';

export default buildCrudRouter({
  controller: teamMemberController,
  createSchema: createTeamMemberSchema,
  updateSchema: updateTeamMemberSchema,
});
