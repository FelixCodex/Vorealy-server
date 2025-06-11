import crypto from 'node:crypto';
import { getDateNow } from '../../../../../shared/utils/utils.js';
import { WorkspaceAssignation } from '../../domain/entity/workspaceAssignation.js';

export default function createAssignation(
	assignationRepository,
	workspaceMemberRepository
) {
	return async function ({
		userId,
		workspaceId,
		parentType,
		parentId,
		assignedBy,
	}) {
		try {
			const member = await workspaceMemberRepository.getMember(
				workspaceId,
				userId
			);

			if (!member) {
				throw new Error('El usuario no pertenece al workspace');
			}

			const exists = await assignationRepository.exists(
				userId,
				workspaceId,
				parentType,
				parentId
			);

			if (exists) {
				throw new Error('La asignación ya existe');
			}

			const now = getDateNow();

			const assignation = new WorkspaceAssignation(
				crypto.randomUUID(),
				userId,
				workspaceId,
				parentType,
				parentId,
				now,
				assignedBy
			);

			return await assignationRepository.create(assignation);
		} catch (err) {
			console.error(
				'Error en WorkspaceAssignationUseCases.createAssignation:',
				err
			);
			throw err;
		}
	};
}
