export default function getWorkspaceMembers(workspaceMemberRepository) {
	return async function (workspaceId) {
		try {
			return await workspaceMemberRepository.getByWorkspaceId(workspaceId);
		} catch (error) {
			throw new Error(
				`Error al obtener miembros del workspace: ${workspaceId}`
			);
		}
	};
}
