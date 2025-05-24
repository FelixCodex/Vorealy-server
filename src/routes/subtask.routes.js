import { Router } from 'express';
import createSubTaskController from '../modules/taskManager/subtask/interfaces/controllers/subtask.controller';
import workspacePermissionMiddleware from '../modules/taskManager/workspace/infrastructure/workspacePermission';
import workspaceMatchMiddleware from '../modules/taskManager/workspace/infrastructure/workspaceMatch';
import { createAuthRequiredMiddelware } from '../modules/auth/infrastructure/middelwares/authRequired';
import { SECRET_JWT_KEY } from '../config';
import {
	createSubTaskInputSchema,
	CreateSubTaskSchema,
	DeleteSubTasksByTaskIdSchema,
	DeleteSubTaskSchema,
	GetSubTaskByIdSchema,
	GetSubTasksByTaskIdSchema,
	updateSubTaskInputSchema,
	UpdateSubTaskSchema,
} from '../modules/taskManager/subtask/infrastructure/schemas/subtask.schema';
import { validateSchema } from '../shared/middlewares/validateSchemaMiddleware';

export const createSubTaskRouter = Repository => {
	const router = Router();

	const subTaskController = createSubTaskController(Repository);
	const authRequired = createAuthRequiredMiddelware(SECRET_JWT_KEY);

	router.use(authRequired);

	router.get(
		'/subtask/:id',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(Repository),
		subTaskController.getSubTaskById
	);

	router.get(
		'/subtask/task/:taskId',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(Repository, 'taskId', 'getByTaskId'),
		subTaskController.getSubTasksByTaskId
	);

	router.post(
		'/subtask',
		validateSchema(createSubTaskInputSchema),
		workspacePermissionMiddleware(['admin', 'member']),
		subTaskController.createSubTask
	);

	router.put(
		'/subtask/:id',
		validateSchema(updateSubTaskInputSchema),
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(Repository),
		subTaskController.updateSubTask
	);

	router.delete(
		'/subtask/:id',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(Repository),
		subTaskController.deleteSubTask
	);

	router.delete(
		'/subtask/task/:taskId',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(Repository, 'taskId', 'getByTaskId'),
		subTaskController.deleteSubTasksByTaskId
	);

	return router;
};
