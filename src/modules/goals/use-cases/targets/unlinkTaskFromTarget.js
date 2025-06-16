export function unlinkTaskFromTarget(goalsRepository) {
	return async function (targetId, taskId) {
		try {
			const link = await goalsRepository.getLinkByTaskIdAndTargetId(
				targetId,
				taskId
			);
			if (link) {
				throw new Error(`Enlace no encontrado`);
			}

			const success = await goalsRepository.unlinkTaskFromTarget(
				targetId,
				taskId
			);
			return success;
		} catch (error) {
			throw new Error(`Error en unlinkTaskFromTargetUseCase: ${error.message}`);
		}
	};
}
