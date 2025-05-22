export function getUserActivityHistory(changeHistoryRepository) {
	return async function (userId, options = {}) {
		if (!userId) {
			throw new Error('El ID del usuario es obligatorio');
		}
		try {
			return changeHistoryRepository.getUserActivityHistory(userId, options);
		} catch (error) {
			throw new Error(`Error al crear un registro: ${error.message}`);
		}
	};
}
