import { Router } from 'express';
import { createAuthRequiredMiddelware } from '../modules/auth/infrastructure/middelwares/authRequired.js';
import { SECRET_JWT_KEY } from '../config.js';
import { updateWorkspaceMemberRoleInputSchema } from '../modules/taskManager/workspace/infrastructure/schemas/workspaceMember.schema.js';
import workspacePermissionMiddleware from '../modules/taskManager/workspace/infrastructure/middleware/workspacePermission.js';
import { validateSchema } from '../shared/middlewares/validateSchemaMiddleware.js';
import createWorkspaceInvitationController from '../modules/taskManager/workspace/interfaces/controllers/workspaceInvitation.controller.js';

export const createWorkspaceInvitationRouter = (
	invitationRepo,
	workspaceRepo,
	memberRepo,
	userRepo,
	memberService,
	notificationService
) => {
	const router = Router();

	const workspaceInvitationController = createWorkspaceInvitationController({
		invitationRepo,
		userRepository: userRepo,
		workspaceMemberRepository: memberRepo,
		workspaceRespository: workspaceRepo,
		memberService,
		notificationService,
	});
	const authRequired = createAuthRequiredMiddelware(SECRET_JWT_KEY);

	router.use(authRequired);

	router.get('/invitations', workspaceInvitationController.getByUser);

	router.post(
		'/workspaces/:workspaceId/invite/:userEmail',
		workspacePermissionMiddleware(memberRepo, ['admin'], workspaceRepo),
		workspaceInvitationController.create
	);

	router.put(
		'/invitations/accept/:invitationId',
		workspaceInvitationController.acceptInvitation
	);

	return router;
};
