export default function addWorkspaceMember(workspaceMemberRepository) {
	return async function ({ workspaceId, userId, role = 'guest', invitedBy }) {
		try {
			// Verificar si ya es miembro
			const existingMember = await workspaceMemberRepository.getMember(
				workspaceId,
				userId
			);
			if (existingMember) {
				throw new Error('El usuario ya es miembro de este workspace');
			}

			const joinedAt = new Date().toISOString();
			const wokspaceMember = new WorkspaceMember(
				workspaceId,
				userId,
				role,
				joinedAt,
				invitedBy
			);
			return await workspaceMemberRepository.addMember(wokspaceMember);
		} catch (error) {
			throw new Error(`Error al añadir miembro al workspace: ${error.message}`);
		}
	};
}
