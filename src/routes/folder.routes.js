import { Router } from 'express';
import createFolderController from '../modules/taskManager/folder/interfaces/controllers/folder.controller.js';
import workspacePermissionMiddleware from '../modules/taskManager/workspace/infrastructure/middleware/workspacePermission.js';
import workspaceMatchMiddleware from '../modules/taskManager/workspace/infrastructure/middleware/workspaceMatch.js';
import { createAuthRequiredMiddelware } from '../modules/auth/infrastructure/middelwares/authRequired.js';
import { SECRET_JWT_KEY } from '../config.js';
import { validateSchema } from '../shared/middlewares/validateSchemaMiddleware.js';
import {
	createFolderInputSchema,
	updateFolderInputSchema,
} from '../modules/taskManager/folder/infrastructure/schemas/folder.schema.js';

export const createFolderRouter = (
	Repository,
	projectRepo,
	workspaceRepo,
	memberRepo
) => {
	const router = Router();

	const folderController = createFolderController(Repository, projectRepo);
	const authRequired = createAuthRequiredMiddelware(SECRET_JWT_KEY);

	router.use(authRequired);

	router.get(
		'/workspaces/:workspaceId/folders/:id',
		workspacePermissionMiddleware(
			memberRepo,
			['admin', 'member'],
			workspaceRepo
		),
		workspaceMatchMiddleware(Repository),
		folderController.getFolderById
	);

	router.get(
		'/workspaces/:workspaceId/folders/project/:projectId',
		workspacePermissionMiddleware(
			memberRepo,
			['admin', 'member'],
			workspaceRepo
		),
		workspaceMatchMiddleware(Repository, 'projectId', 'getByProjectId'),
		folderController.getFoldersByProjectId
	);

	router.post(
		'/workspaces/:workspaceId/folders',
		validateSchema(createFolderInputSchema),
		workspacePermissionMiddleware(
			memberRepo,
			['admin', 'member'],
			workspaceRepo
		),
		folderController.createFolder
	);

	router.put(
		'/workspaces/:workspaceId/folders/:id',
		validateSchema(updateFolderInputSchema),
		workspacePermissionMiddleware(
			memberRepo,
			['admin', 'member'],
			workspaceRepo
		),
		workspaceMatchMiddleware(Repository),
		folderController.updateFolder
	);

	router.delete(
		'/workspaces/:workspaceId/folders/:id',
		workspacePermissionMiddleware(
			memberRepo,
			['admin', 'member'],
			workspaceRepo
		),
		workspaceMatchMiddleware(Repository),
		folderController.deleteFolder
	);

	router.delete(
		'/workspaces/:workspaceId/folders/project/:projectId',
		workspacePermissionMiddleware(
			memberRepo,
			['admin', 'member'],
			workspaceRepo
		),
		workspaceMatchMiddleware(Repository, 'projectId', 'getByProjectId'),
		folderController.deleteFoldersByProjectId
	);

	return router;
};
