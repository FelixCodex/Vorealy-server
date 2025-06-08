import { Router } from 'express';
import { createGoogleController } from '../modules/auth/interfaces/controllers/google.controller.js';

export const createGoogleAuthRouter = ({ passport, CLIENT_URL }) => {
	const router = Router();

	const googleAuthController = createGoogleController({ passport, CLIENT_URL });

	router.get('/auth/google', googleAuthController.auth);

	router.get('/auth/google/callback', googleAuthController.authCallback);

	router.get('/auth/success', googleAuthController.authSuccess);

	router.get('/auth/failure', googleAuthController.authFailure);

	return router;
};
