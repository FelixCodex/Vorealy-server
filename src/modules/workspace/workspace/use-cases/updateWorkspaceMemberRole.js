export default function updateWorkspaceMemberRole(workspaceMemberRepository) {
	return async function (workspaceId, userId, role) {
		try {
			// Verificar que el miembro existe
			const existingMember = await workspaceMemberRepository.getMember(
				workspaceId,
				userId
			);
			if (!existingMember) {
				throw new Error('El usuario no es miembro de este workspace');
			}

			// Validar rol
			const validRoles = ['owner', 'admin', 'member', 'guest'];
			if (!validRoles.includes(role)) {
				throw new Error('Rol no válido');
			}

			return await workspaceMemberRepository.updateRole(
				workspaceId,
				userId,
				role
			);
		} catch (error) {
			throw new Error(`Error al actualizar rol de miembro: ${workspaceId}`);
		}
	};
}
