import {
	generateRandomCharacters,
	getDateNow,
} from '../../../../shared/utils/utils.js';

export function createTarget(goalsRepository) {
	return async function ({
		goalId,
		workspaceId,
		name,
		description,
		targetType,
		targetValue,
		unit,
	}) {
		try {
			const id = generateRandomCharacters(36);
			const now = getDateNow();
			const targetData = {
				id,
				goalId,
				workspaceId,
				name,
				description,
				targetType,
				targetValue,
				unit,
				createAt: now,
				updatedAt: now,
			};

			const target = await goalsRepository.createTarget(targetData);
			return target;
		} catch (error) {
			throw new Error(`Error en createTargetUseCase: ${error.message}`);
		}
	};
}
