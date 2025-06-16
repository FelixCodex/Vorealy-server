import {
	generateRandomCharacters,
	getDateNow,
} from '../../../../shared/utils/utils.js';

export function recordProgress(goalsRepository) {
	return async function ({
		goalId,
		targetId,
		previousValue,
		newValue,
		notes,
		userId,
	}) {
		try {
			const id = generateRandomCharacters(36);
			const now = getDateNow();
			const progressData = {
				id,
				goalId,
				targetId,
				previousValue,
				newValue,
				notes,
				recordedBy: userId,
				recordedAt: now,
			};

			const progress = await goalsRepository.recordProgress(progressData);
			return progress;
		} catch (error) {
			throw new Error(`Error en recordProgressUseCase: ${error.message}`);
		}
	};
}
