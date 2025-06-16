import {
	generateRandomCharacters,
	getDateNow,
} from '../../../../shared/utils/utils.js';

export function linkTaskToTarget(goalsRepository, taskRepository) {
	return async function ({ targetId, taskId, userId }) {
		try {
			const task = await taskRepository.getById(taskId);
			if (!task) {
				throw new Error(`Tarea no encontrada`);
			}

			const previousLink = await goalsRepository.getLinkByTaskIdAndTargetId(
				targetId,
				taskId
			);
			if (previousLink) {
				throw new Error(`La tarea y el objetivo ya estan enlazados`);
			}

			const id = generateRandomCharacters(36);
			const now = getDateNow();
			const linkData = {
				id,
				targetId,
				taskId,
				createdBy: userId,
				createdAt: now,
			};

			const link = await goalsRepository.linkTaskToTarget(linkData);
			return link;
		} catch (error) {
			throw new Error(`Error en linkTaskToTargetUseCase: ${error.message}`);
		}
	};
}
