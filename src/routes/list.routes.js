import { Router } from 'express';
import workspacePermissionMiddleware from '../modules/taskManager/workspace/infrastructure/middleware/workspacePermission.js';
import workspaceMatchMiddleware from '../modules/taskManager/workspace/infrastructure/middleware/workspaceMatch.js';
import { createAuthRequiredMiddelware } from '../modules/auth/infrastructure/middelwares/authRequired.js';
import { SECRET_JWT_KEY } from '../config.js';
import { validateSchema } from '../shared/middlewares/validateSchemaMiddleware.js';
import {
	createListInputSchema,
	listParentInputSchema,
	updateListInputSchema,
} from '../modules/taskManager/list/infrastructure/schemas/list.schema.js';
import createListController from '../modules/taskManager/list/interfaces/controller/list.controller.js';

export const createListRouter = (
	Repository,
	projectRepo,
	folderRepo,
	workspaceRepo,
	memberRepo
) => {
	const router = Router();

	const listController = createListController(
		Repository,
		projectRepo,
		folderRepo
	);
	const authRequired = createAuthRequiredMiddelware(SECRET_JWT_KEY);

	router.use(authRequired);

	router.get(
		'/workspaces/:workspaceId/lists/:id',
		workspacePermissionMiddleware(
			memberRepo,
			['admin', 'member'],
			workspaceRepo
		),
		workspaceMatchMiddleware(Repository),
		listController.getListById
	);

	router.get(
		'/workspaces/:workspaceId/lists/parent/:parentId/:parentType',
		workspacePermissionMiddleware(
			memberRepo,
			['admin', 'member'],
			workspaceRepo
		),
		workspaceMatchMiddleware(
			Repository,
			['parentId', 'parentType'],
			'getByParent'
		),
		listController.getListsByParent
	);

	router.post(
		'/workspaces/:workspaceId/lists',
		validateSchema(createListInputSchema),
		workspacePermissionMiddleware(
			memberRepo,
			['admin', 'member'],
			workspaceRepo
		),
		listController.createList
	);

	router.put(
		'/workspaces/:workspaceId/lists/:id',
		validateSchema(updateListInputSchema),
		workspacePermissionMiddleware(
			memberRepo,
			['admin', 'member'],
			workspaceRepo
		),
		workspaceMatchMiddleware(Repository),
		listController.updateList
	);

	router.put(
		'/workspaces/:workspaceId/lists/changeparent/:id',
		validateSchema(listParentInputSchema),
		workspacePermissionMiddleware(
			memberRepo,
			['admin', 'member'],
			workspaceRepo
		),
		workspaceMatchMiddleware(Repository),
		listController.changeListParent
	);

	router.delete(
		'/workspaces/:workspaceId/lists/:id',
		workspacePermissionMiddleware(
			memberRepo,
			['admin', 'member'],
			workspaceRepo
		),
		workspaceMatchMiddleware(Repository),
		listController.deleteList
	);

	router.delete(
		'/workspaces/:workspaceId/lists/parent/:parentId/:parentType',
		workspacePermissionMiddleware(
			memberRepo,
			['admin', 'member'],
			workspaceRepo
		),
		workspaceMatchMiddleware(
			Repository,
			['parentId', 'parentType'],
			'getByParent'
		),
		listController.deleteListsByParent
	);

	return router;
};
