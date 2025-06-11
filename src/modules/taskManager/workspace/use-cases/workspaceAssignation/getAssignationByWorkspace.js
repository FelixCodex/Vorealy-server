export default function getAssignationsByWorkspace(assignationRepository) {
	return async function (workspaceId, options = {}) {
		try {
			return await assignationRepository.findByWorkspace(workspaceId, options);
		} catch (err) {
			console.error(
				'Error en WorkspaceAssignationUseCases.getAssignationsByWorkspace:',
				err
			);
			throw err;
		}
	};
}
