import { Router } from 'express';
import createDocumentController from '../modules/documents/interfaces/controllers/document.controller.js';
import workspacePermissionMiddleware from '../modules/taskManager/workspace/infrastructure/middleware/workspacePermission.js';
import workspaceMatchMiddleware from '../modules/taskManager/workspace/infrastructure/middleware/workspaceMatch.js';
import { createAuthRequiredMiddelware } from '../modules/auth/infrastructure/middelwares/authRequired.js';
import {
	createDocumentInputSchema,
	updateDocumentInputSchema,
} from '../modules/documents/infrastructure/schemas/document.schema';
import { SECRET_JWT_KEY } from '../config';

export const createDocumentRouter = Repository => {
	const router = Router();

	const docController = createDocumentController(Repository);
	const authRequired = createAuthRequiredMiddelware(SECRET_JWT_KEY);

	router.use(authRequired);

	router.get(
		'/workspaces/:workspaceId/document/:id',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(Repository),
		docController.getDocumentById
	);

	router.get(
		'/workspaces/:workspaceId/document/parent/:parentId/:parentType',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(
			Repository,
			['parentId', 'parentType'],
			'getByParent'
		),
		docController.getDocumentsByParent
	);

	router.post(
		'/workspace/:workspaceId/document',
		validateSchema(createDocumentInputSchema),
		workspacePermissionMiddleware(['admin', 'member']),
		docController.createDocument
	);

	router.put(
		'/workspaces/:workspaceId/document/:id',
		validateSchema(updateDocumentInputSchema),
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(Repository),
		docController.updateDocument
	);

	router.delete(
		'/workspaces/:workspaceId/document/:id',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(Repository),
		docController.deleteDocument
	);

	router.delete(
		'/workspaces/:workspaceId/document/parent/:parentId/:parentType',
		workspacePermissionMiddleware(['admin', 'member']),
		workspaceMatchMiddleware(
			Repository,
			['parentId', 'parentType'],
			'getByParent'
		),
		docController.deleteDocumentsByParent
	);

	return router;
};
