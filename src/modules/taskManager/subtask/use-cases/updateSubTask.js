export default function updateSubTask(subtaskRepository) {
	return async function (id, taskData) {
		try {
			const existingProject = await subtaskRepository.getById(id);
			if (!existingProject) {
				throw new Error(`Proyecto con ID ${id} no encontrado`);
			}

			taskData.updatedAt = new Date().toISOString();

			const updatedProject = await subtaskRepository.update({
				id,
				...taskData,
			});

			return updatedProject;
		} catch (error) {
			throw new Error(`Error al actualizar proyecto: ${error.message}`);
		}
	};
}
