import { Router } from 'express';
import { UserController } from './interfaces/controllers/user.controller.js';

export const createUserRouter = Repository => {
	const router = Router();

	const userController = new UserController(Repository);

	router.post('/users', userController.create);

	return router;
};
