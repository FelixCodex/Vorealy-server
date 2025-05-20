export default function getUserWorkspaces(workspaceRepository) {
	return async function (userId) {
		try {
			return await workspaceRepository.getByUserId(userId);
		} catch (error) {
			throw new Error(
				`Error al obtener workspaces del usuario: ${error.message}`
			);
		}
	};
}
