export default function getTaskById(taskRepository) {
	return async function (id) {
		try {
			const task = await taskRepository.getById(id);
			if (!task) {
				throw new Error(`Tarea con ID ${id} no encontrado`);
			}
			return task;
		} catch (error) {
			throw new Error(`Error al obtener tarea por ID: ${error.message}`);
		}
	};
}
