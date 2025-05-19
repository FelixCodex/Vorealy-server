export default function getWorkspaceMember(workspaceMemberRepository) {
	return async function (workspaceId, userId) {
		try {
			const member = await workspaceMemberRepository.getMember(
				workspaceId,
				userId
			);
			if (!member) {
				throw new Error('Usuario no es miembro del workspace');
			}
			return member;
		} catch (error) {
			throw new Error(`Error al obtener miembro del workspace: ${workspaceId}`);
		}
	};
}
