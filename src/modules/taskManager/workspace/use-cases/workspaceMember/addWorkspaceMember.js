import crypto from 'node:crypto';
import { getDateNow } from '../../../../../shared/utils/utils.js';
import { WorkspaceMember } from '../../domain/entity/WorkspaceMember.js';

export default function addWorkspaceMember(
	workspaceRepository,
	workspaceMemberRepository
) {
	return async function ({ workspaceId, userId, role = 'guest', invitedBy }) {
		try {
			const workspace = await workspaceRepository.getById(workspaceId);

			if (!workspace) {
				throw new Error('Workspace no encontrado');
			}
			if (workspace.owner_id === userId) {
				throw new Error('No se puede invitar al propietario del workspace');
			}

			const existingMember = await workspaceMemberRepository.getMember(
				workspaceId,
				userId
			);
			if (existingMember) {
				throw new Error('El usuario ya es miembro de este workspace');
			}

			const joinedAt = getDateNow();
			const wokspaceMember = new WorkspaceMember(
				crypto.randomUUID(),
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
