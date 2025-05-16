import { Router } from 'express';
import { AuthController } from './interfaces/controllers/auth.controller';

export const createAuthRouter = Repository => {
	const router = Router();

	const authController = AuthController(Repository);

	router.post(
		'/register',
		validateSchema(registerSchema),
		authController.register
	);
	router.post('/login', validateSchema(loginSchema), authController.login);
	router.get('/logout', authController.logout);
	router.get('/verify', authRequired, authController.verify);

	return router;
};
