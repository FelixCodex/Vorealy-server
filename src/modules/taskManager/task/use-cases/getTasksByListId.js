export default function getTasksByListId(taskRepository) {
	return async function (listId) {
		try {
			const tasks = await taskRepository.getByListId(listId);
			if (!tasks) {
				throw new Error(`Tarea con ID ${id} no encontrado`);
			}
			return tasks;
		} catch (error) {
			throw new Error(`Error al obtener las tareas por ID: ${error.message}`);
		}
	};
}
