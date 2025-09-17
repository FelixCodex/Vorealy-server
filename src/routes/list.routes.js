import { Router } from 'express';
import workspacePermissionMiddleware from '../modules/taskManager/workspace/infrastructure/middleware/workspacePermission.js';
import workspaceMatchMiddleware from '../modules/taskManager/workspace/infrastructure/middleware/workspaceMatch.js';
import { createAuthRequiredMiddelware } from '../modules/auth/infrastructure/middelwares/authRequired.js';
import { SECRET_JWT_KEY } from '../config.js';
import { validateSchema } from '../shared/middlewares/validateSchemaMiddleware.js';
import {
	createListInputSchema,
	createStatusInputSchema,
	listParentInputSchema,
	updateListInputSchema,
	updateStatusInputSchema,
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

	router.get(
		'/workspaces/:workspaceId/lists',
		workspacePermissionMiddleware(
			memberRepo,
			['admin', 'member'],
			workspaceRepo
		),
		listController.getListsByWorkspaceId
	);

	router.get(
		'/workspaces/:workspaceId/lists/:listId/statuses',
		workspacePermissionMiddleware(
			memberRepo,
			['admin', 'member'],
			workspaceRepo
		),
		listController.getStatusesByListId
	);

	router.get(
		'/workspaces/:workspaceId/lists/folder/:folderId/statuses',
		workspacePermissionMiddleware(
			memberRepo,
			['admin', 'member'],
			workspaceRepo
		),
		listController.getStatusesByFolderId
	);

	router.get(
		'/workspaces/:workspaceId/lists/project/:projectId/statuses',
		workspacePermissionMiddleware(
			memberRepo,
			['admin', 'member'],
			workspaceRepo
		),
		listController.getStatusesByProjectId
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

	router.post(
		'/workspaces/:workspaceId/lists/:listId/status',
		validateSchema(createStatusInputSchema),
		workspacePermissionMiddleware(
			memberRepo,
			['admin', 'member'],
			workspaceRepo
		),
		listController.createStatus
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
		'/workspaces/:workspaceId/lists/status/:statusId',
		validateSchema(updateStatusInputSchema),
		workspacePermissionMiddleware(
			memberRepo,
			['admin', 'member'],
			workspaceRepo
		),
		listController.updateStatus
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
		'/workspaces/:workspaceId/status/:id',
		workspacePermissionMiddleware(
			memberRepo,
			['admin', 'member'],
			workspaceRepo
		),
		listController.deleteStatus
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
