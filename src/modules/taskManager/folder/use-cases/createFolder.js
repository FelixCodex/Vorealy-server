import crypto from 'node:crypto';
import { Folder } from '../domain/entity/Folder.js';
import { getDateNow } from '../../../../shared/utils/utils.js';
export default function createFolder(folderRepository, projectRepository) {
	return async function ({
		projectId,
		workspaceId,
		name,
		description,
		color,
		icon,
		isPrivate,
		automationRules,
		createdBy,
		updatedBy,
		metadata,
	}) {
		try {
			if (!name || !projectId) {
				throw new Error(
					'El nombre de la carpeta y el ID del proyecto son obligatorios'
				);
			}

			const project = await projectRepository.getById(projectId);

			if (!project) {
				throw new Error('Proyecto no encontrado');
			}

			const now = getDateNow();
			const folder = new Folder(
				crypto.randomUUID(),
				projectId,
				workspaceId,
				name,
				description,
				color,
				icon,
				isPrivate,
				automationRules,
				now,
				createdBy,
				now,
				updatedBy,
				metadata
			);

			return await folderRepository.create(folder);
		} catch (error) {
			throw new Error(`Error al crear carpeta: ${error.message}`);
		}
	};
}
