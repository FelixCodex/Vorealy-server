import { Router } from 'express';
import createWorkspaceAssignationController from '../modules/taskManager/workspace/interfaces/controllers/workspaceAssignation.controller';
import { createAuthRequiredMiddelware } from '../modules/auth/infrastructure/middelwares/authRequired';
import { SECRET_JWT_KEY } from '../config';
import { validateSchema } from '../shared/middlewares/validateSchemaMiddleware';

export const createWorkspaceInvitationRouter = (
	assignationRepo,
	workspaceRepo,
	memberRepo
) => {
	const router = Router();

	const workspaceAssignationController = createWorkspaceAssignationController(
		assignationRepo,
		memberRepo
	);
	const authRequired = createAuthRequiredMiddelware(SECRET_JWT_KEY);

	router.use(authRequired);

	router.get(
		'/assignations/:userId',
		workspaceAssignationController.getAssignationsByUser
	);

	router.get(
		'/workspaces/:workspaceId/assignations',
		workspaceAssignationController.getAssignationsByWorkspace
	);

	router.get(
		'/workspaces/:workspaceId/assignations/parent/:parentId/:parentType',
		workspaceAssignationController.getAssignationsByParent
	);

	router.post(
		'/workspaces/:workspaceId/assignations',
		validateSchema(createAssignationSchema),
		workspacePermissionMiddleware(memberRepo, ['admin'], workspaceRepo),
		workspaceAssignationController.createAssignation
	);

	router.delete(
		'/workspaces/:workspaceId/assignations/:id',
		workspacePermissionMiddleware(memberRepo, ['admin'], workspaceRepo),
		workspaceAssignationController.deleteAssignation
	);

	return router;
};
