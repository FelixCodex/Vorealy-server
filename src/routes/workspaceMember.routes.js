import { Router } from 'express';
import createWorkspaceMemberController from '../modules/workspace/workspace/interfaces/controllers/workspaceMember.controller';
import { createAuthRequiredMiddelware } from '../modules/auth/infrastructure/middelwares/authRequired';
import { SECRET_JWT_KEY } from '../config';
import workspacePermissionMiddleware from '../modules/taskManager/workspace/infrastructure/workspacePermission';
import {
	addWorkspaceMemberInputSchema,
	updateWorkspaceMemberRoleInputSchema,
} from '../modules/taskManager/workspace/infrastructure/schemas/workspaceMember.schema';

export const createWorkspaceMemberRouter = Repository => {
	const router = Router();

	const workspaceMemberController = createWorkspaceMemberController(Repository);
	const authRequired = createAuthRequiredMiddelware(SECRET_JWT_KEY);

	router.get(
		'/workspaces/:workspaceId/members',
		authRequired,
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMemberController.getMembers
	);

	router.get(
		'/workspaces/:workspaceId/members/:userId',
		authRequired,
		workspacePermissionMiddleware(['admin']),
		workspaceMemberController.getMember
	);

	router.post(
		'/workspaces/:workspaceId/members',
		authRequired,
		validateSchema(addWorkspaceMemberInputSchema),
		workspacePermissionMiddleware(['admin']),
		workspaceMemberController.addMember
	);

	router.put(
		'/workspaces/:workspaceId/members/:userId',
		authRequired,
		validateSchema(updateWorkspaceMemberRoleInputSchema),
		workspacePermissionMiddleware(['admin']),
		workspaceMemberController.updateRole
	);

	router.delete(
		'/workspaces/:workspaceId/members/:userId',
		authRequired,
		workspacePermissionMiddleware(['admin']),
		workspaceMemberController.removeMember
	);

	router.delete(
		'/workspaces/:workspaceId/members',
		authRequired,
		workspacePermissionMiddleware(['admin']),
		workspaceMemberController.removeAllMembers
	);

	return router;
};
