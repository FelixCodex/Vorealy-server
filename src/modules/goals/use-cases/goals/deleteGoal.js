export function deleteGoal(goalsRepository) {
	return async function (goalId) {
		try {
			const existingGoal = await goalsRepository.getGoalById(id);
			if (!existingGoal) {
				throw new Error(`Meta con ID ${id} no encontrado`);
			}
			const success = await goalsRepository.deleteGoal(goalId);
			return success;
		} catch (error) {
			throw new Error(`Error en deleteGoalUseCase: ${error.message}`);
		}
	};
}
