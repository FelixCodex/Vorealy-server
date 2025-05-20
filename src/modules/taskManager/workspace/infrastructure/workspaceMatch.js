export default function workspaceMatchMiddleware(itemRepository) {
	return async (req, res, next) => {
		try {
			const workspaceId = req.params.workspaceId;
			const id = req.params.id;

			if (!workspaceId) {
				return res.status(400).json({
					success: false,
					message: 'ID de workspace no proporcionado',
				});
			}

			const item = await itemRepository.getById(id);

			if (item.workspace_id == workspaceId) {
				next();
			}

			throw new Error('El item no pertence al workspace');
		} catch (error) {
			console.error('Error en workspacePermissionMiddleware:', error);
			return res.status(500).json({
				success: false,
				message: 'Error al verificar coincidencia con el workspace',
			});
		}
	};
}
