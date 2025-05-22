import { Router } from 'express';
import { createChangeHistoryController } from '../modules/changeHistory/interfaces/controllers/changeHistory.controller';
import isUserMatchMiddleware from '../shared/middlewares/isUserMatchMiddleware';

export const createProjectRouter = Repository => {
	const router = Router();

	const changeHitoryController = createChangeHistoryController(Repository);
	const authRequired = createAuthRequiredMiddelware(SECRET_JWT_KEY);

	router.use(authRequired);

	router.get(
		'/history/entity/:entityType/:entityId',
		changeHitoryController.getEntityHistory
	);

	router.get(
		'/history/user/:userId',
		isUserMatchMiddleware(),
		changeHitoryController.getUserActivity
	);

	return router;
};
