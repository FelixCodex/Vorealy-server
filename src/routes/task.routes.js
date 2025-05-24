import { Router } from 'express';
import createTaskController from '../modules/taskManager/task/interfaces/controllers/task.controller';
import workspacePermissionMiddleware from '../modules/taskManager/workspace/infrastructure/workspacePermission';
import workspaceMatchMiddleware from '../modules/taskManager/workspace/infrastructure/workspaceMatch';
import { createAuthRequiredMiddelware } from '../modules/auth/infrastructure/middelwares/authRequired';
import { SECRET_JWT_KEY } from '../config';
import { validateSchema } from '../shared/middlewares/validateSchemaMiddleware';
import {
	createTaskInputSchema,
	CreateTaskSchema,
	DeleteTasksByListIdSchema,
	DeleteTaskSchema,
	GetTaskByIdSchema,
	GetTasksByListIdSchema,
	updateTaskInputSchema,
	UpdateTaskSchema,
} from '../modules/taskManager/task/infrastructure/schemas/task.schema';

export const createTaskRouter = Repository => {
	const router = Router();

	const taskController = createTaskController(Repository);
	const authRequired = createAuthRequiredMiddelware(SECRET_JWT_KEY);

	router.use(authRequired);

	router.get(
		'/tasks/:id',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(Repository),
		taskController.getTaskById
	);

	router.get(
		'/tasks/list/:listId',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(Repository, 'listId', 'getByListId'),
		taskController.getTasksByListId
	);

	router.post(
		'/tasks',
		validateSchema(createTaskInputSchema),
		workspacePermissionMiddleware(['admin', 'member']),
		taskController.createTask
	);

	router.put(
		'/tasks/:id',
		validateSchema(updateTaskInputSchema),
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(Repository),
		taskController.updateTask
	);

	router.delete(
		'/tasks/:id',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(Repository),
		taskController.deleteTask
	);

	router.delete(
		'/tasks/list/:listId',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(Repository, 'listId', 'getByListId'),
		taskController.deleteTasksByListId
	);

	return router;
};
