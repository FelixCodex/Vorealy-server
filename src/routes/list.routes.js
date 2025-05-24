import { Router } from 'express';
import createListController from '../modules/taskManager/list/interfaces/controllers/list.controller';
import workspacePermissionMiddleware from '../modules/taskManager/workspace/infrastructure/workspacePermission';
import workspaceMatchMiddleware from '../modules/taskManager/workspace/infrastructure/workspaceMatch';
import { createAuthRequiredMiddelware } from '../modules/auth/infrastructure/middelwares/authRequired';
import { SECRET_JWT_KEY } from '../config';
import { validateSchema } from '../shared/middlewares/validateSchemaMiddleware';
import {
	createListInputSchema,
	CreateListSchema,
	updateListInputSchema,
	UpdateListSchema,
} from '../modules/taskManager/list/infrastructure/schemas/list.schema';

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
			'getByParentId'
		),
		listController.getListsByParent
	);

	router.post(
		'/workspace/:workspaceId/lists',
		validateSchema(createListInputSchema),
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(Repository),
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
			'getByParentId'
		),
		listController.deleteListsByParent
	);

	return router;
};
