/**
 * Middleware para verificar si un usuario tiene los permisos necesarios en un workspace
 * @param {Array} allowedRoles - Roles permitidos para acceder al recurso
 * @returns {Function} - Middleware de Express
 */
export default function workspacePermissionMiddleware(
	workspaceMemberRepository,
	allowedRoles = []
) {
	return async (req, res, next) => {
		try {
			const workspaceId = req.params.workspaceId;
			const userId = req.user.id;

			if (!workspaceId) {
				return res.status(400).json({
					success: false,
					message: 'ID de workspace no proporcionado',
				});
			}

			const member = await workspaceMemberRepository.getMember(
				workspaceId,
				userId
			);

			if (!member) {
				return res.status(403).json({
					success: false,
					message: 'No tienes acceso a este workspace',
				});
			}

			if (allowedRoles.length > 0 && !allowedRoles.includes(member.role)) {
				return res.status(403).json({
					success: false,
					message: 'No tienes suficientes permisos para realizar esta acción',
				});
			}

			next();
		} catch (error) {
			console.error('Error en workspacePermissionMiddleware:', error);
			return res.status(500).json({
				success: false,
				message: 'Error al verificar permisos en el workspace',
			});
		}
	};
}
