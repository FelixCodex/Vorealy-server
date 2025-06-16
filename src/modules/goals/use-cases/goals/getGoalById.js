export function getGoalById(goalsRepository) {
	return async function (goalId) {
		try {
			const goal = await goalsRepository.getGoalById(goalId);
			if (!goal) {
				throw new Error(`Meta con ID ${id} no encontrado`);
			}
			return goal;
		} catch (error) {
			throw new Error(`Error en getGoalByIdUseCase: ${error.message}`);
		}
	};
}
