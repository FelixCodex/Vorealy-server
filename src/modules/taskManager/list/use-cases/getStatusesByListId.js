export function getStatusesByListId(listRepository) {
	return async function (listId) {
		try {
			if (!listId) {
				throw new Error(`El ID de la lista es obligatorio`);
			}

			const list = await listRepository.getById(listId);
			if (!list) {
				throw new Error(`Lista con ID ${listId} no encontrada`);
			}

			const statuses = await listRepository.getStatusesByListId(listId);

			if (!statuses || statuses.length === 0) {
				return [];
			}

			return statuses;
		} catch (error) {
			throw new Error(
				`Error al obtener statuses por ID de lista: ${error.message}`
			);
		}
	};
}
