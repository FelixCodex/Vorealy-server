import {
	generateRandomCharacters,
	getDateNow,
} from '../../../../shared/utils/utils.js';

export function createGoal(goalsRepository) {
	return async function ({ name, description, workspaceId, userId }) {
		try {
			const now = getDateNow();
			const id = generateRandomCharacters(36);
			const goalData = {
				id,
				name,
				description,
				workspaceId,
				createdBy: userId,
				createdAt: now,
				updatedBy: userId,
				updatedAt: now,
			};

			const goal = await goalsRepository.createGoal(goalData);
			return goal;
		} catch (error) {
			throw new Error(`Error en createGoalUseCase: ${error.message}`);
		}
	};
}
