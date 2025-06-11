import { Router } from 'express';
import createProjectController from '../modules/taskManager/project/interfaces/controllers/projects.controller.js';
import { createAuthRequiredMiddelware } from '../modules/auth/infrastructure/middelwares/authRequired.js';
import { SECRET_JWT_KEY } from '../config.js';
import { validateSchema } from '../shared/middlewares/validateSchemaMiddleware.js';
import {
	createProjectInputSchema,
	updateProjectInputSchema,
} from '../modules/taskManager/project/infrastructure/schemas/project.schema.js';
import workspacePermissionMiddleware from '../modules/taskManager/workspace/infrastructure/middleware/workspacePermission.js';
import workspaceMatchMiddleware from '../modules/taskManager/workspace/infrastructure/middleware/workspaceMatch.js';

export const createProjectRouter = (Repository, workspaceRepo, memberRepo) => {
	const router = Router();

	const projectController = createProjectController(Repository);
	const authRequired = createAuthRequiredMiddelware(SECRET_JWT_KEY);

	router.use(authRequired);

	router.get(
		'/workspaces/:workspaceId/projects/:id',
		workspacePermissionMiddleware(
			memberRepo,
			['admin', 'member'],
			workspaceRepo
		),
		workspaceMatchMiddleware(Repository),
		projectController.getProjectById
	);

	router.get(
		'/workspaces/:workspaceId/projects',
		workspacePermissionMiddleware(
			memberRepo,
			['admin', 'member'],
			workspaceRepo
		),
		projectController.getProjectsByWorkspaceId
	);

	router.post(
		'/workspaces/:workspaceId/projects',
		validateSchema(createProjectInputSchema),
		workspacePermissionMiddleware(memberRepo, ['admin'], workspaceRepo),
		projectController.createProject
	);

	router.put(
		'/workspaces/:workspaceId/projects/:id',
		validateSchema(updateProjectInputSchema),
		workspacePermissionMiddleware(memberRepo, ['admin'], workspaceRepo),
		workspaceMatchMiddleware(Repository),
		projectController.updateProject
	);

	router.delete(
		'/workspaces/:workspaceId/projects',
		workspacePermissionMiddleware(memberRepo, ['admin'], workspaceRepo),
		projectController.deleteProjectsByWorkspaceId
	);

	router.delete(
		'/workspaces/:workspaceId/projects/:id',
		workspacePermissionMiddleware(memberRepo, ['admin'], workspaceRepo),
		workspaceMatchMiddleware(Repository),
		projectController.deleteProject
	);

	return router;
};
