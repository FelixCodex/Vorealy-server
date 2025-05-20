export default function getSubTasksByTaskId(subtaskRepository) {
	return async function (listId) {
		try {
			const tasks = await subtaskRepository.getByTaskId(listId);
			if (!tasks) {
				throw new Error(`Tarea con ID ${id} no encontrado`);
			}
			return tasks;
		} catch (error) {
			throw new Error(`Error al obtener las tareas por ID: ${error.message}`);
		}
	};
}
