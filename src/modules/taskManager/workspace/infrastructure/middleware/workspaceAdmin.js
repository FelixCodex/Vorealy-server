export default function workspaceAdminMiddleware(workspaceRepository) {
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

			const workspace = await workspaceRepository.getById(workspaceId);

			if (!workspace) {
				return res.status(404).json({
					success: false,
					message: 'Workspace no encontrado',
				});
			}

			if (workspace.owner_id != userId) {
				return res.status(403).json({
					success: false,
					message: 'No tienes acceso a este workspace',
				});
			}

			next();
		} catch (error) {
			console.error('Error en workspaceAdminMiddleware:', error);
			return res.status(500).json({
				success: false,
				message: 'Error al verificar el admin del workspace',
			});
		}
	};
}
