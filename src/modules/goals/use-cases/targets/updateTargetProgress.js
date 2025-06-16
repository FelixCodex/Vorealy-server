import { getDateNow } from '../../../../shared/utils/utils.js';

export function updateTargetProgress(goalsRepository) {
	return async function ({ targetId, currentValue }) {
		try {
			const now = getDateNow();
			const success = await goalsRepository.updateTargetProgress({
				id: targetId,
				currentValue,
				updatedAt: now,
			});
			return success;
		} catch (error) {
			throw new Error(`Error en updateTargetProgressUseCase: ${error.message}`);
		}
	};
}
