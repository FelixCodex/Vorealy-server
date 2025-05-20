export default function deleteSubTasksByTaskId(subtaskRepository) {
	return async function (listId) {
		try {
			return await subtaskRepository.deleteByTaskId(listId);
		} catch (error) {
			throw new Error(
				`Error al eliminar tarea por id de lista: ${error.message}`
			);
		}
	};
}
