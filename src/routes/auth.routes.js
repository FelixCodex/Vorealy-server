import { Router } from 'express';
import { AuthController } from '../modules/auth/interfaces/controllers/auth.controller.js';
import {
	LoginSchema,
	RegisterSchema,
} from '../modules/auth/infrastructure/schemas/auth.schema.js';
import { validateSchema } from '../shared/middlewares/validateSchemaMiddleware.js';
import { createAuthRequiredMiddelware } from '../modules/auth/infrastructure/middelwares/authRequired.js';
import { SECRET_JWT_KEY } from '../config.js';

export const createAuthRouter = Repository => {
	const router = Router();

	const authController = AuthController(Repository);
	const authRequired = createAuthRequiredMiddelware(SECRET_JWT_KEY);

	router.post(
		'/register',
		validateSchema(RegisterSchema),
		authController.register
	);
	router.post('/login', validateSchema(LoginSchema), authController.login);
	router.get('/logout', authController.logout);
	router.get('/verify', authRequired, authController.validate);

	return router;
};
