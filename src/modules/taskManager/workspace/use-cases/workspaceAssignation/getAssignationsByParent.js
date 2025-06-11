export default function getAssignationsByParent(assignationRepository) {
	return async function (parentType, parentId) {
		try {
			return await assignationRepository.findByParent(parentType, parentId);
		} catch (err) {
			console.error(
				'Error en WorkspaceAssignationUseCases.getAssignationsByParent:',
				err
			);
			throw err;
		}
	};
}
