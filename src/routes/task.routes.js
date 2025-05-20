import { Router } from 'express';
import createTaskController from '../modules/taskManager/task/interfaces/controllers/task.controller';
import workspacePermissionMiddleware from '../modules/taskManager/workspace/infrastructure/workspacePermission';
import workspaceMatchMiddleware from '../modules/taskManager/workspace/infrastructure/workspaceMatch';
import { createAuthRequiredMiddelware } from '../modules/auth/infrastructure/middelwares/authRequired';
import { SECRET_JWT_KEY } from '../config';

export const createTaskRouter = Repository => {
	const router = Router();

	const taskController = createTaskController(Repository);
	const authRequired = createAuthRequiredMiddelware(SECRET_JWT_KEY);

	// /**
	//  * @route   GET /api/tasks
	//  * @desc    Obtener todas las tareas
	//  * @access  Private
	//  */
	// router.get('/', authRequired, taskController.getAllTasks);

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
		workspacePermissionMiddleware(['admin', 'member']),
		taskController.createTask
	);

	router.put(
		'/tasks/:id',
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
