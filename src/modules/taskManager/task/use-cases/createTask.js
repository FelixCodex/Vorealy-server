export default function creteTask(taskRepository) {
	return async function (taskData) {
		try {
			if (!taskData.name || !taskData.workspaceId) {
				throw new Error(
					'El nombre de la tarea y el ID del workspace son obligatorios'
				);
			}

			if (!taskData.createdAt) {
				taskData.createdAt = new Date().toISOString();
			}
			if (!taskData.updatedAt) {
				taskData.updatedAt = taskData.createdAt;
			}

			return await taskRepository.create(taskData);
		} catch (error) {
			throw new Error(`Error al crear tarea: ${error.message}`);
		}
	};
}
