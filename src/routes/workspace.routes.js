import { Router } from 'express';
import createWorkspaceController from '../modules/taskManager/workspace/interfaces/controllers/workspace.controller';
import { createAuthRequiredMiddelware } from '../modules/auth/infrastructure/middelwares/authRequired';
import { SECRET_JWT_KEY } from '../config';

export const createWorkspaceRouter = Repository => {
	const router = Router();

	const workspaceController = createWorkspaceController(Repository);
	const authRequired = createAuthRequiredMiddelware(SECRET_JWT_KEY);

	router.get('/workspaces/user/:userId', authRequired, (req, res) => {
		if (req.user.id !== req.params.userId) {
			return res.status(403).json({
				success: false,
				message: 'No tienes permiso para ver los workspaces de este usuario',
			});
		}
		return workspaceController.getUserWorkspaces(req, res);
	});

	router.post('/workspaces', authRequired, workspaceController.create);

	router.put(
		'/workspaces/:workspaceId',
		authRequired,
		workspacePermissionMiddleware(['admin']),
		workspaceController.update
	);

	router.delete(
		'/workspaces/:workspaceId',
		authRequired,
		workspaceController.delete
	);

	return router;
};
