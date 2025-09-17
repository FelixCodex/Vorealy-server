import { Router } from 'express';
import createWorkspaceAssignationController from '../modules/taskManager/workspace/interfaces/controllers/workspaceAssignation.controller.js';
import { createAuthRequiredMiddelware } from '../modules/auth/infrastructure/middelwares/authRequired.js';
import { SECRET_JWT_KEY } from '../config.js';
import { validateSchema } from '../shared/middlewares/validateSchemaMiddleware.js';
import { createAssignationSchema } from '../modules/taskManager/workspace/infrastructure/schemas/workspaceAssignation.schema.js';
import workspacePermissionMiddleware from '../modules/taskManager/workspace/infrastructure/middleware/workspacePermission.js';

export const createWorkspaceAssignationRouter = (
	assignationRepo,
	projectRepo,
	folderRepo,
	listRepo,
	taskRepo,
	goalRepo,
	workspaceRepo,
	memberRepo
) => {
	const router = Router();

	const workspaceAssignationController = createWorkspaceAssignationController(
		assignationRepo,
		memberRepo,
		projectRepo,
		folderRepo,
		listRepo,
		taskRepo,
		goalRepo
	);
	const authRequired = createAuthRequiredMiddelware(SECRET_JWT_KEY);

	router.use(authRequired);

	router.get(
		'/assignations/:userId',
		workspaceAssignationController.getAssignationsByUser
	);

	router.get(
		'/workspaces/:workspaceId/assignations',
		workspacePermissionMiddleware(
			memberRepo,
			['admin', 'member'],
			workspaceRepo
		),
		workspaceAssignationController.getAssignationsByWorkspace
	);

	router.get(
		'/workspaces/:workspaceId/assignations/parent/:parentId/:parentType',
		workspacePermissionMiddleware(
			memberRepo,
			['admin', 'member'],
			workspaceRepo
		),
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
