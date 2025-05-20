export default function deleteTask(taskRepository) {
	return async function (id) {
		try {
			const existingTask = await taskRepository.getById(id);
			if (!existingTask) {
				throw new Error(`Carpeta con ID ${id} no encontrada`);
			}

			return await taskRepository.delete(id);
		} catch (error) {
			throw new Error(`Error al eliminar tarea: ${error.message}`);
		}
	};
}
