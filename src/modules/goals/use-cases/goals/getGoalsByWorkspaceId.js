export function getGoalsByWorkspaceId(goalsRepository) {
	return async function (workspaceId) {
		try {
			const goals = await goalsRepository.getGoalsByWorkspaceId(workspaceId);
			return goals;
		} catch (error) {
			throw new Error(
				`Error en getGoalsByWorkspaceIdUseCase: ${error.message}`
			);
		}
	};
}
