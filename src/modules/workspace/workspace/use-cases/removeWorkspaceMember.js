export default function removeWorkspaceMember(workspaceMemberRepository) {
	return async function (workspaceId, userId) {
		try {
			// Verificar que el miembro existe
			const existingMember = await workspaceMemberRepository.getMember(
				workspaceId,
				userId
			);
			if (!existingMember) {
				throw new Error('El usuario no es miembro de este workspace');
			}

			return await workspaceMemberRepository.removeMember(workspaceId, userId);
		} catch (error) {
			throw new Error(
				`Error al eliminar miembro del workspace: ${error.message}`
			);
		}
	};
}
