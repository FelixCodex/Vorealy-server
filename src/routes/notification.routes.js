import { Router } from 'express';
import createNotificationController from '../modules/notifications/interfaces/controllers/notification.controller.js';
import { SECRET_JWT_KEY } from '../config.js';
import { createAuthRequiredMiddelware } from '../modules/auth/infrastructure/middelwares/authRequired.js';

export const createNotificationRouter = notificationRepo => {
	const router = Router();

	const notificationController = createNotificationController(notificationRepo);
	const authRequired = createAuthRequiredMiddelware(SECRET_JWT_KEY);

	router.use(authRequired);

	router.get('/notifications', notificationController.getByUser);

	router.put(
		'/notifications/mark/:notificationId',
		notificationController.markAsRead
	);

	return router;
};
