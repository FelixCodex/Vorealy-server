export function getTargetsByGoalId(goalsRepository) {
	return async function (goalId) {
		try {
			const targets = await goalsRepository.getTargetsByGoalId(goalId);
			return targets;
		} catch (error) {
			throw new Error(`Error en getTargetsByGoalIdUseCase: ${error.message}`);
		}
	};
}
