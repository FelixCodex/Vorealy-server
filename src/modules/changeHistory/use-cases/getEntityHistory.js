export function getEntityHistory(changeHistoryRepository) {
	return async function (entityType, entityId, options = {}) {
		if (!entityType || !entityId) {
			throw new Error('El nombre de la entidad y el tipo son obligatorios');
		}
		try {
			return changeHistoryRepository.getEntityHistory(
				entityType,
				entityId,
				options
			);
		} catch (error) {
			throw new Error(
				`Error al obtener los registros de una entidad: ${error.message}`
			);
		}
	};
}
