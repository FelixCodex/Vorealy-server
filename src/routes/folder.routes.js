import { Router } from 'express';
import createFolderController from '../modules/taskManager/folder/interfaces/controllers/folder.controller';
import workspacePermissionMiddleware from '../modules/taskManager/workspace/infrastructure/workspacePermission';
import workspaceMatchMiddleware from '../modules/taskManager/workspace/infrastructure/workspaceMatch';
import { createAuthRequiredMiddelware } from '../modules/auth/infrastructure/middelwares/authRequired';
import { SECRET_JWT_KEY } from '../config';
import { validateSchema } from '../shared/middlewares/validateSchemaMiddleware';
import {
	createFolderInputSchema,
	updateFolderInputSchema,
} from '../modules/taskManager/folder/infrastructure/schemas/folder.schema';

export const createFolderRouter = Repository => {
	const router = Router();

	const folderController = createFolderController(Repository);
	const authRequired = createAuthRequiredMiddelware(SECRET_JWT_KEY);

	// router.get(
	// 	'/folders',
	// 	authRequired,
	// 	workspacePermissionMiddleware(['admin', 'member']),
	// 	folderController.getAllFolders
	// );

	router.use(authRequired);

	router.get(
		'/workspaces/:workspaceId/folders/:id',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(Repository),
		folderController.getFolderById
	);

	router.get(
		'/workspaces/:workspaceId/folders/project/:projectId',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(Repository, 'projectId', 'getByProjectId'),
		folderController.getFoldersByProjectId
	);

	router.post(
		'/workspace/:workspaceId/folders',
		validateSchema(createFolderInputSchema),
		workspacePermissionMiddleware(['admin', 'member']),
		folderController.createFolder
	);

	router.put(
		'/workspace/:workspaceId/folders/:id',
		validateSchema(updateFolderInputSchema),
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(Repository),
		folderController.updateFolder
	);

	router.delete(
		'/workspace/:workspaceId/folders/:id',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(Repository),
		folderController.deleteFolder
	);

	router.delete(
		'/workspace/:workspaceId/folders/project/:projectId',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(Repository, 'projectId', 'getByProjectId'),
		folderController.deleteFoldersByProjectId
	);

	return router;
};
