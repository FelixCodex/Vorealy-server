import { Router } from 'express';
import createProjectController from '../modules/taskManager/project/interfaces/controllers/project.controller';
import workspacePermissionMiddleware from '../modules/taskManager/workspace/infrastructure/workspacePermission';
import workspaceMatchMiddleware from '../modules/taskManager/workspace/infrastructure/workspaceMatch';
import { createAuthRequiredMiddelware } from '../modules/auth/infrastructure/middelwares/authRequired';
import { SECRET_JWT_KEY } from '../config';
import { validateSchema } from '../shared/middlewares/validateSchemaMiddleware';
import {
	createProjectInputSchema,
	CreateProjectSchema,
	updateProjectInputSchema,
	UpdateProjectSchema,
} from '../modules/taskManager/project/infrastructure/schemas/project.schema';

export const createProjectRouter = Repository => {
	const router = Router();

	const projectController = createProjectController(Repository);
	const authRequired = createAuthRequiredMiddelware(SECRET_JWT_KEY);

	// router.get(
	// 	'/projects',
	// 	authRequired,
	// 	projectController.getAllProjects
	// );

	router.use(authRequired);

	router.get(
		'/workspaces/:workspaceId/projects/:id',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(Repository),
		projectController.getProjectById
	);

	router.get(
		'/workspaces/:workspaceId/projects',
		workspacePermissionMiddleware(['admin', 'member']),
		projectController.getProjectsByWorkspaceId
	);

	router.post(
		'/workspaces/:workspaceId/projects',
		validateSchema(createProjectInputSchema),
		workspacePermissionMiddleware(['admin', 'member']),
		projectController.createProject
	);

	router.put(
		'/workspaces/:workspaceId/projects/:id',
		validateSchema(updateProjectInputSchema),
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(Repository),
		projectController.updateProject
	);

	router.delete(
		'/workspaces/:workspaceId/projects',
		workspacePermissionMiddleware(['admin', 'member']),
		projectController.deleteProjectsByWorkspaceId
	);

	router.delete(
		'/workspaces/:workspaceId/projects/:id',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(Repository),
		projectController.deleteProject
	);

	return router;
};
