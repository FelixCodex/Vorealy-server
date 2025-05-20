export default function deleteSubTask(subtaskRepository) {
	return async function (id) {
		try {
			const existingTask = await subtaskRepository.getById(id);
			if (!existingTask) {
				throw new Error(`Carpeta con ID ${id} no encontrada`);
			}

			return await subtaskRepository.delete(id);
		} catch (error) {
			throw new Error(`Error al eliminar tarea: ${error.message}`);
		}
	};
}
