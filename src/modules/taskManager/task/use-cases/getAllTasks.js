export default function getAllTasks(taskRepository) {
	return async function () {
		try {
			return await taskRepository.getAll();
		} catch (error) {
			throw new Error(`Error al obtener tareas: ${error.message}`);
		}
	};
}
