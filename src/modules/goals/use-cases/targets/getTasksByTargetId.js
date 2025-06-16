export function getTasksByTargetId(goalsRepository) {
	return async function (targetId) {
		try {
			const tasks = await goalsRepository.getTasksByTargetId(targetId);
			return tasks;
		} catch (error) {
			throw new Error(`Error en getTasksByTargetIdUseCase: ${error.message}`);
		}
	};
}
