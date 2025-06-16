import { getDateNow } from '../../../../shared/utils/utils.js';

export function updateGoal(goalsRepository) {
	return async function ({ goalId, updateData, userId }) {
		try {
			const now = getDateNow();
			const updateParams = {
				id: goalId,
				...updateData,
				updatedBy: userId,
				updatedAt: now,
			};

			const goalUpdated = await goalsRepository.updateGoal(updateParams);
			return goalUpdated;
		} catch (error) {
			throw new Error(`Error en updateGoalUseCase: ${error.message}`);
		}
	};
}
