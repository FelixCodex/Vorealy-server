import { Router } from 'express';
import createTaskController from '../modules/taskManager/task/interfaces/controllers/task.controller.js';
import workspacePermissionMiddleware from '../modules/taskManager/workspace/infrastructure/middleware/workspacePermission.js';
import workspaceMatchMiddleware from '../modules/taskManager/workspace/infrastructure/middleware/workspaceMatch.js';
import { createAuthRequiredMiddelware } from '../modules/auth/infrastructure/middelwares/authRequired.js';
import { SECRET_JWT_KEY } from '../config.js';
import { validateSchema } from '../shared/middlewares/validateSchemaMiddleware.js';
import {
	createTaskInputSchema,
	updateTaskInputSchema,
} from '../modules/taskManager/task/infrastructure/schemas/task.schema.js';

export const createTaskRouter = (
	Repository,
	projectRepository,
	folderRepository,
	listRepository,
	workspaceRepository,
	memberRepository
) => {
	const router = Router();

	const taskController = createTaskController(
		Repository,
		projectRepository,
		folderRepository,
		listRepository
	);
	const authRequired = createAuthRequiredMiddelware(SECRET_JWT_KEY);

	router.use(authRequired);

	router.get(
		'/workspaces/:workspaceId/tasks/:id',
		workspacePermissionMiddleware(
			memberRepository,
			['admin', 'member'],
			workspaceRepository
		),
		workspaceMatchMiddleware(Repository),
		taskController.getTaskById
	);

	router.get(
		'/workspaces/:workspaceId/tasks/list/:listId',
		workspacePermissionMiddleware(
			memberRepository,
			['admin', 'member'],
			workspaceRepository
		),
		workspaceMatchMiddleware(listRepository, 'listId'),
		taskController.getTasksByListId
	);

	router.get(
		'/workspaces/:workspaceId/tasks/folder/:folderId',
		workspacePermissionMiddleware(
			memberRepository,
			['admin', 'member'],
			workspaceRepository
		),
		workspaceMatchMiddleware(folderRepository, 'folderId'),
		taskController.getTasksByFolderId
	);

	router.get(
		'/workspaces/:workspaceId/tasks/project/:projectId',
		workspacePermissionMiddleware(
			memberRepository,
			['admin', 'member'],
			workspaceRepository
		),
		workspaceMatchMiddleware(projectRepository, 'projectId'),
		taskController.getTasksByProjectId
	);

	router.post(
		'/workspaces/:workspaceId/tasks',
		validateSchema(createTaskInputSchema),
		workspacePermissionMiddleware(
			memberRepository,
			['admin', 'member'],
			workspaceRepository
		),
		taskController.createTask
	);

	router.put(
		'/workspaces/:workspaceId/tasks/:id',
		validateSchema(updateTaskInputSchema),
		workspacePermissionMiddleware(
			memberRepository,
			['admin', 'member'],
			workspaceRepository
		),
		workspaceMatchMiddleware(Repository),
		taskController.updateTask
	);

	router.delete(
		'/workspaces/:workspaceId/tasks/:id',
		workspacePermissionMiddleware(
			memberRepository,
			['admin', 'member'],
			workspaceRepository
		),
		workspaceMatchMiddleware(Repository),
		taskController.deleteTask
	);

	router.delete(
		'/workspaces/:workspaceId/tasks/list/:listId',
		workspacePermissionMiddleware(
			memberRepository,
			['admin', 'member'],
			workspaceRepository
		),
		workspaceMatchMiddleware(Repository, 'listId', 'getByListId'),
		taskController.deleteTasksByListId
	);

	return router;
};
