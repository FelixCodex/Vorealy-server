export default function deleteTasksByListId(taskRepository) {
	return async function (listId) {
		try {
			return await taskRepository.deleteByListId(listId);
		} catch (error) {
			throw new Error(
				`Error al eliminar tarea por id de lista: ${error.message}`
			);
		}
	};
}
