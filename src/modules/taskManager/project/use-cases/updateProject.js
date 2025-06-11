import { getDateNow } from '../../../../shared/utils/utils.js';

export default function updateProject(projectRepository) {
	return async function (id, projectData) {
		try {
			const existingProject = await projectRepository.getById(id);
			if (!existingProject) {
				throw new Error(`Proyecto con ID ${id} no encontrado`);
			}

			projectData.updatedAt = getDateNow();

			const updatedProject = await projectRepository.update({
				id,
				...projectData,
			});

			return updatedProject;
		} catch (error) {
			throw new Error(`Error al actualizar proyecto: ${error.message}`);
		}
	};
}
