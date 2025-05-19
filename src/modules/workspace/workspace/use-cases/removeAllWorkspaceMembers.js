export default function removeAllWorkspaceMembers(workspaceMemberRepository) {
	return async function (workspaceId) {
		try {
			return await workspaceMemberRepository.removeAllMembers(workspaceId);
		} catch (error) {
			throw new Error(
				`Error al eliminar todos los miembros del workspace: ${workspaceId}`
			);
		}
	};
}
