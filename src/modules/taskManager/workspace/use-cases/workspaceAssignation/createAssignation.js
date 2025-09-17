import crypto from 'node:crypto';
import { getDateNow } from '../../../../../shared/utils/utils.js';
import { WorkspaceAssignation } from '../../domain/entity/workspaceAssignation.js';

export default function createAssignation(
	assignationRepository,
	memberRepository,
	projectRepository,
	folderRepository,
	listRepository,
	taskRepository,
	goalRepository
) {
	return async function ({
		userId,
		workspaceId,
		parentType,
		parentId,
		assignedBy,
	}) {
		try {
			if (parentType == 'project') {
				const parent = await projectRepository.getById(parentId);
				if (!parent) {
					throw new Error('Projecto padre no encontrad');
				}
			} else if (parentType == 'folder') {
				const parent = await folderRepository.getById(parentId);
				if (!parent) {
					throw new Error('Carpeta padre no encontrad');
				}
			} else if (parentType == 'list') {
				const parent = await listRepository.getById(parentId);
				if (!parent) {
					throw new Error('Lista padre no encontrad');
				}
			} else if (parentType == 'task') {
				const parent = await taskRepository.getById(parentId);
				if (!parent) {
					throw new Error('Tarea padre no encontrad');
				}
			} else if (parentType == 'target') {
				const parent = await goalRepository.getTargetById(parentId);
				if (!parent) {
					throw new Error('Objetivo padre no encontrad');
				}
			} else {
				throw new Error('El tipo del padre no es valid');
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

			const member = await memberRepository.getByUserId(userId);

			if (!member) {
				throw new Error('El usuario ha asignar no pertenece al workspace');
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
