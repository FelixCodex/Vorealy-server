import { getDateNow } from '../../../../shared/utils/utils.js';

export default function updateFolder(folderRepository, projectRepository) {
	return async function (id, workspaceId, folderData) {
		try {
			const existingFolder = await folderRepository.getById(id);
			if (!existingFolder) {
				throw new Error(`Carpeta con ID ${id} no encontrada`);
			}

			if (folderData.projectId) {
				const project = await projectRepository.getById(folderData.projectId);
				if (!project) {
					throw new Error(`Proyecto no encontrado`);
				}
				if (project.workspace_id != workspaceId) {
					throw new Error(`No puedes mover un projecto a otro workspace`);
				}
			}

			folderData.updatedAt = getDateNow();

			const updatedFolder = await folderRepository.update({
				id,
				...folderData,
			});

			return updatedFolder;
		} catch (error) {
			throw new Error(`Error al actualizar carpeta: ${error.message}`);
		}
	};
}
