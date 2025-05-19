import { Router } from 'express';
import createWorkspaceMemberController from '../modules/workspace/workspace/interfaces/controllers/workspaceMember.controller';
import { createAuthRequiredMiddelware } from '../modules/auth/infrastructure/middelwares/authRequired';
import { SECRET_JWT_KEY } from '../config';

export const createWorkspaceMemberRouter = Repository => {
	const router = Router();

	const workspaceMemberController = createWorkspaceMemberController(Repository);
	const authRequiredMiddleware = createAuthRequiredMiddelware(SECRET_JWT_KEY);

	router.get(
		'/workspaces/:workspaceId/members',
		authRequiredMiddleware,
		workspacePermissionMiddleware(['admin', 'member']),
		(req, res) => workspaceMemberController.getMembers(req, res)
	);

	router.get(
		'/users/:userId/workspaces',
		authRequiredMiddleware,
		(req, res) => {
			if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
				return res.status(403).json({
					success: false,
					message: 'No tienes permiso para ver los workspaces de este usuario',
				});
			}
			return workspaceMemberController.getUserWorkspaces(req, res);
		}
	);

	router.get(
		'/workspaces/:workspaceId/members/:userId',
		authRequiredMiddleware,
		workspacePermissionMiddleware(['owner', 'admin']),
		(req, res) => workspaceMemberController.getMember(req, res)
	);

	// Añadir un miembro al workspace
	router.post(
		'/workspaces/:workspaceId/members',
		authRequiredMiddleware,
		workspacePermissionMiddleware(['owner', 'admin']),
		(req, res) => workspaceMemberController.addMember(req, res)
	);

	// Actualizar el rol de un miembro del workspace
	router.put(
		'/workspaces/:workspaceId/members/:userId',
		authRequiredMiddleware,
		workspacePermissionMiddleware(['owner']),
		(req, res) => workspaceMemberController.updateRole(req, res)
	);

	// Eliminar un miembro del workspace
	router.delete(
		'/workspaces/:workspaceId/members/:userId',
		authRequiredMiddleware,
		workspacePermissionMiddleware(['owner', 'admin']),
		(req, res) => workspaceMemberController.removeMember(req, res)
	);

	router.delete(
		'/workspaces/:workspaceId/members',
		authRequiredMiddleware,
		workspacePermissionMiddleware(['owner']),
		(req, res) => workspaceMemberController.removeAllMembers(req, res)
	);

	return router;
};
