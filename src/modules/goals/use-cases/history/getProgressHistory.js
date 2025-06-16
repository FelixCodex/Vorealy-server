export function getProgressHistory(goalsRepository) {
	return async function (goalId, limit = 50) {
		try {
			const history = await goalsRepository.getProgressHistory(goalId, limit);
			return history;
		} catch (error) {
			throw new Error(`Error en getProgressHistoryUseCase: ${error.message}`);
		}
	};
}
