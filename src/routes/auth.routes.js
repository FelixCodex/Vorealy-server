import { Router } from 'express';
import { AuthController } from '../modules/auth/interfaces/controllers/auth.controller';
import {
	LoginSchema,
	RegisterSchema,
} from '../modules/auth/infrastructure/schemas/auth.schema';
import { validateSchema } from '../shared/middlewares/validateSchemaMiddleware';

export const createAuthRouter = Repository => {
	const router = Router();

	const authController = AuthController(Repository);

	router.post(
		'/register',
		validateSchema(RegisterSchema),
		authController.register
	);
	router.post('/login', validateSchema(LoginSchema), authController.login);
	router.get('/logout', authController.logout);
	router.get('/verify', authRequired, authController.verify);

	return router;
};
