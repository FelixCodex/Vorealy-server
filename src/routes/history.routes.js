import { Router } from 'express';
import { createChangeHistoryController } from '../modules/changeHistory/interfaces/controllers/changeHistory.controller.js';
import workspacePermissionMiddleware from '../modules/taskManager/workspace/infrastructure/middleware/workspacePermission.js';
import workspaceMatchMiddleware from '../modules/taskManager/workspace/infrastructure/middleware/workspaceMatch.js';
import isUserMatchMiddleware from '../shared/middlewares/isUserMatchMiddleware.js';
import { validateSchema } from '../shared/middlewares/validateSchemaMiddleware.js';
import {
	getEntityHistoryQuerySchema,
	getUserActivityQuerySchema,
} from '../modules/changeHistory/infrastructure/schemas/changeHistory.schema.js';

export const createProjectRouter = Repository => {
	const router = Router();

	const changeHitoryController = createChangeHistoryController(Repository);
	const authRequired = createAuthRequiredMiddelware(SECRET_JWT_KEY);

	router.use(authRequired);

	router.get(
		'/history/entity/:entityType/:entityId',

		validateSchema(getEntityHistoryQuerySchema),
		changeHitoryController.getEntityHistory
	);

	router.get(
		'/history/user/:userId',
		validateSchema(getUserActivityQuerySchema),
		isUserMatchMiddleware(),
		changeHitoryController.getUserActivity
	);

	return router;
};
