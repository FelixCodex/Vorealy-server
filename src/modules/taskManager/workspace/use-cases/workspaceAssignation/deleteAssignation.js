export default function deleteAssignation(assignationRepository) {
	return async function (id) {
		try {
			const assignation = await assignationRepository.findById(id);

			if (!assignation) {
				throw new Error('Asignación no encontrada');
			}

			return await assignationRepository.delete(id);
		} catch (err) {
			console.error(
				'Error en WorkspaceAssignationUseCases.deleteAssignation:',
				err
			);
			throw err;
		}
	};
}
