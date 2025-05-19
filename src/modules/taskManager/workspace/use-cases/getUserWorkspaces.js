export default function getUserWorkspaces(workspaceMemberRepository) {
	return async function (userId) {
		try {
			return await workspaceMemberRepository.getByUserId(userId);
		} catch (error) {
			throw new Error(
				`Error al obtener workspaces del usuario: ${error.message}`
			);
		}
	};
}
