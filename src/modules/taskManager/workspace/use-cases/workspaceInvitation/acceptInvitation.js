import { compareDates, getDateNow } from '../../../../../shared/utils/utils.js';

export default function acceptInvitation(
	workspaceInvitationRepository,
	memberService
) {
	return async function ({ invitationId, userId }) {
		const now = getDateNow();
		try {
			const invitation = await workspaceInvitationRepository.getById(
				invitationId
			);
			if (!invitation) {
				throw new Error('Invitacion no encontrada');
			}

			if (invitation.status == 'accepted') {
				throw new Error('La invitacion ya ha sido aceptada');
			}

			if (compareDates(now, invitation.expires_at)) {
				throw new Error('La invitacion ha expirado');
			}

			if (invitation.invited_user_id != userId) {
				throw new Error('No tienes permiso para aceptar esta invitacion');
			}

			await workspaceInvitationRepository.acceptInvitation(invitationId, now);

			console.log(invitation);

			if (memberService.addMember) {
				await memberService.addMember({
					workspaceId: invitation.workspace_id,
					userId,
					role: invitation.role,
					joinedAt: now,
					invitedBy: invitation.invited_by_user_id,
				});
			}

			return { success: true };
		} catch (error) {
			throw new Error(`Error en acceptInvitation: ${error.message}`);
		}
	};
}
