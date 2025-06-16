export function deleteTarget(goalsRepository) {
	return async function (targetId) {
		try {
			const existingTarget = await goalsRepository.getTargetById(id);
			if (!existingTarget) {
				throw new Error(`Objetivo con ID ${id} no encontrado`);
			}
			const success = await goalsRepository.deleteTarget(targetId);
			return success;
		} catch (error) {
			throw new Error(`Error en deleteTargetUseCase: ${error.message}`);
		}
	};
}
