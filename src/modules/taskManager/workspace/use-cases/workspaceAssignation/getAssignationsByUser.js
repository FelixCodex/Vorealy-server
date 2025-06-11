export default function getAssignationsByUser(assignationRepository) {
	return async function (userId, workspaceId = null) {
		try {
			return await assignationRepository.findByUser(userId, workspaceId);
		} catch (err) {
			console.error(
				'Error en WorkspaceAssignationUseCases.getAssignationsByUser:',
				err
			);
			throw err;
		}
	};
}
