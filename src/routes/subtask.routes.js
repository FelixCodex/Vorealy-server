import { Router } from 'express';
import createSubTaskController from '../modules/taskManager/subtask/interfaces/controllers/subtask.controller.js';
import workspacePermissionMiddleware from '../modules/taskManager/workspace/infrastructure/middleware/workspacePermission.js';
import workspaceMatchMiddleware from '../modules/taskManager/workspace/infrastructure/middleware/workspaceMatch.js';
import { createAuthRequiredMiddelware } from '../modules/auth/infrastructure/middelwares/authRequired.js';
import { SECRET_JWT_KEY } from '../config.js';
import {
	createSubTaskInputSchema,
	updateSubTaskInputSchema,
} from '../modules/taskManager/subtask/infrastructure/schemas/subtask.schema.js';
import { validateSchema } from '../shared/middlewares/validateSchemaMiddleware.js';

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
