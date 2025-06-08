import { Router } from 'express';
import workspacePermissionMiddleware from '../modules/taskManager/workspace/infrastructure/middleware/workspacePermission.js';
import workspaceMatchMiddleware from '../modules/taskManager/workspace/infrastructure/middleware/workspaceMatch.js';
import { createAuthRequiredMiddelware } from '../modules/auth/infrastructure/middelwares/authRequired.js';
import { SECRET_JWT_KEY } from '../config.js';
import { validateSchema } from '../shared/middlewares/validateSchemaMiddleware.js';
import {
	createListInputSchema,
	updateListInputSchema,
} from '../modules/taskManager/list/infrastructure/schemas/list.schema.js';
import createListController from '../modules/taskManager/list/interfaces/controller/list.controller.js';

export const createListRouter = Repository => {
	const router = Router();

	const listController = createListController(Repository);
	const authRequired = createAuthRequiredMiddelware(SECRET_JWT_KEY);

	router.use(authRequired);

	router.get(
		'/workspaces/:workspaceId/lists/:id',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(Repository),
		listController.getListById
	);

	router.get(
		'/workspaces/:workspaceId/lists/parent/:parentId/:parentType',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(
			Repository,
			['parentId', 'parentType'],
			'getByParent'
		),
		listController.getListsByParent
	);

	router.post(
		'/workspace/:workspaceId/lists',
		validateSchema(createListInputSchema),
		workspacePermissionMiddleware(['admin', 'member']),
		listController.createList
	);

	router.put(
		'/workspaces/:workspaceId/lists/:id',
		validateSchema(updateListInputSchema),
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(Repository),
		listController.updateList
	);

	router.delete(
		'/workspaces/:workspaceId/lists/:id',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(Repository),
		listController.deleteList
	);

	router.delete(
		'/workspaces/:workspaceId/lists/parent/:parentId/:parentType',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(
			Repository,
			['parentId', 'parentType'],
			'getByParent'
		),
		listController.deleteListsByParent
	);

	return router;
};
