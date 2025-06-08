export default function getUserWorkspaces(workspaceRepository) {
	return async function (userId) {
		try {
			return await workspaceRepository.getAllByUserId(userId);
		} catch (error) {
			throw new Error(
				`Error al obtener workspaces del usuario: ${error.message}`
			);
		}
	};
}
