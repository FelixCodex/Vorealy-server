import { WorkspaceInvitation } from '../../domain/entity/WorkspaceInvitation.js';
import {
	generateRandomCharacters,
	getDateNow,
	getFutureDate,
} from '../../../../../shared/utils/utils.js';

export default function createWorkspaceInvitation(
	workspaceInvitationRepository,
	userRepository,
	workspaceMemberRepository,
	workspaceRespository,
	notificationService
) {
	return async function ({
		title = 'Alguien te invito a un workspace',
		workspaceId,
		userEmail,
		invitedByUserId,
		expiresIn,
		role,
		message,
	}) {
		if (!workspaceId || !userEmail || !invitedByUserId) {
			throw new Error(
				`El ID del workspace, el email del usuario a invitar y el ID del usuario que invita son obligatorios`
			);
		}

		const user = await userRepository.getByEmail(userEmail);
		if (!user) {
			throw new Error(`Usuario no encontrado`);
		}

		if (user.id == invitedByUserId) {
			throw new Error(`No puedes invitarte a ti mismo`);
		}

		const workspace = await workspaceRespository.getById(workspaceId);
		if (workspace.owner_id == user.id) {
			throw new Error(`No se puede invitar al propietario del workspace`);
		}

		const member = await workspaceMemberRepository.getMember(
			workspaceId,
			user.id
		);
		if (member) {
			throw new Error(`El usuario ya es miembro del workspace`);
		}

		console.log(user);

		const now = getDateNow();
		const expires_at = getDateNow(getFutureDate(expiresIn || 10));
		const id = generateRandomCharacters(12);

		try {
			const invitation = new WorkspaceInvitation(
				id,
				workspaceId,
				user.id,
				invitedByUserId,
				role,
				message,
				now,
				expires_at
			);

			await workspaceInvitationRepository.createInvitation(invitation);

			if (notificationService?.createNotification) {
				await notificationService.createNotification({
					recipientId: user.id,
					type: 'invitation',
					title,
					message: message,
					data: { workspaceId, invitedByUserId, invitationId: id },
				});
			}

			return invitation;
		} catch (error) {
			console.log(error);
			throw new Error(`Error en createWorkspaceInvitation: ${error.message}`);
		}
	};
}
