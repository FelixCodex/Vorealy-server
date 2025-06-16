export function getGoalWithTargetsAndProgress(goalsRepository) {
	return async function (goalId) {
		try {
			const goalData = await goalsRepository.getGoalWithTargetsAndProgress(
				goalId
			);
			return goalData;
		} catch (error) {
			throw new Error(
				`Error en getGoalWithTargetsAndProgressUseCase: ${error.message}`
			);
		}
	};
}
