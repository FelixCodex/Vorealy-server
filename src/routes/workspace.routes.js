import { Router } from 'express';
import createWorkspaceController from '../modules/taskManager/workspace/interfaces/controllers/workspace.controller.js';
import { createAuthRequiredMiddelware } from '../modules/auth/infrastructure/middelwares/authRequired.js';
import { SECRET_JWT_KEY } from '../config.js';
import { validateSchema } from '../shared/middlewares/validateSchemaMiddleware.js';
import {
	createWorkspaceInputSchema,
	updateWorkspaceInputSchema,
} from '../modules/taskManager/workspace/infrastructure/schemas/workspace.schema.js';
import workspaceAdminMiddleware from '../modules/taskManager/workspace/infrastructure/middleware/workspaceAdmin.js';

export const createWorkspaceRouter = Repository => {
	const router = Router();

	const workspaceController = createWorkspaceController(Repository);
	const authRequired = createAuthRequiredMiddelware(SECRET_JWT_KEY);

	router.use(authRequired);

	router.get('/workspaces', workspaceController.getUserWorkspaces);

	router.post(
		'/workspaces',
		validateSchema(createWorkspaceInputSchema),
		workspaceController.create
	);

	router.put(
		'/workspaces/:workspaceId',
		validateSchema(updateWorkspaceInputSchema),
		workspaceAdminMiddleware(Repository),
		workspaceController.update
	);

	router.delete(
		'/workspaces/:workspaceId',
		workspaceAdminMiddleware(Repository),
		workspaceController.delete
	);

	return router;
};
