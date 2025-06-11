import { Router } from 'express';
import { createAuthRequiredMiddelware } from '../modules/auth/infrastructure/middelwares/authRequired.js';
import { SECRET_JWT_KEY } from '../config.js';
import {
	addWorkspaceMemberInputSchema,
	updateWorkspaceMemberRoleInputSchema,
} from '../modules/taskManager/workspace/infrastructure/schemas/workspaceMember.schema.js';
import createWorkspaceMemberController from '../modules/taskManager/workspace/interfaces/controllers/workspaceMember.controller.js';
import workspacePermissionMiddleware from '../modules/taskManager/workspace/infrastructure/middleware/workspacePermission.js';
import { validateSchema } from '../shared/middlewares/validateSchemaMiddleware.js';

export const createWorkspaceMemberRouter = (WorkspaceRepo, MemberRepo) => {
	const router = Router();

	const workspaceMemberController = createWorkspaceMemberController(MemberRepo);
	const authRequired = createAuthRequiredMiddelware(SECRET_JWT_KEY);

	router.get(
		'/workspaces/:workspaceId/members',
		authRequired,
		workspacePermissionMiddleware(
			MemberRepo,
			['admin', 'member'],
			WorkspaceRepo
		),
		workspaceMemberController.getMembers
	);

	router.get(
		'/memberships',
		authRequired,
		workspaceMemberController.getUserMemberships
	);

	router.get(
		'/workspaces/:workspaceId/members/:userId',
		authRequired,
		workspacePermissionMiddleware(MemberRepo, ['admin'], WorkspaceRepo),
		workspaceMemberController.getMember
	);

	router.put(
		'/workspaces/:workspaceId/members/:userId/role/:role',
		authRequired,
		workspacePermissionMiddleware(MemberRepo, ['admin'], WorkspaceRepo),
		workspaceMemberController.updateRole
	);

	router.delete(
		'/workspaces/:workspaceId/members/:userId',
		authRequired,
		workspacePermissionMiddleware(MemberRepo, ['admin'], WorkspaceRepo),
		workspaceMemberController.removeMember
	);

	router.delete(
		'/workspaces/:workspaceId/members',
		authRequired,
		workspacePermissionMiddleware(MemberRepo, ['admin'], WorkspaceRepo),
		workspaceMemberController.removeAllMembers
	);

	return router;
};
