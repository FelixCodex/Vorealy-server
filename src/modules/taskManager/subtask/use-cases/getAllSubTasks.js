export default function getAllSubTasks(subtaskRepository) {
	return async function () {
		try {
			return await subtaskRepository.getAll();
		} catch (error) {
			throw new Error(`Error al obtener tareas: ${error.message}`);
		}
	};
}
