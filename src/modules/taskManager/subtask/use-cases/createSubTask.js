export default function createSubTask(subtaskRepository) {
	return async function (subTaskData) {
		try {
			if (!subTaskData.name || !subTaskData.workspaceId) {
				throw new Error(
					'El nombre de la subtarea y el ID del workspace son obligatorios'
				);
			}

			if (!subTaskData.createdAt) {
				subTaskData.createdAt = new Date().toISOString();
			}
			if (!subTaskData.updatedAt) {
				subTaskData.updatedAt = subTaskData.createdAt;
			}

			return await subtaskRepository.create(subTaskData);
		} catch (error) {
			throw new Error(`Error al crear tarea: ${error.message}`);
		}
	};
}
