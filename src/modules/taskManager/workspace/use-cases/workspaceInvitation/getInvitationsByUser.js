export default function getInvitationsByUser(workspaceInvitationRepository) {
	return async function ({ userId, status = 'pending' }) {
		try {
			const invitations =
				await workspaceInvitationRepository.getInvitationsByUser(
					userId,
					status
				);
			return invitations;
		} catch (error) {
			throw new Error(`Error en getInvitationsByUser: ${error.message}`);
		}
	};
}
