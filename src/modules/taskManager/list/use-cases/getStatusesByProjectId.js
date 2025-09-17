export function getStatusesByProjectId(listRepository, projectRepository) {
	return async function (projectId) {
		try {
			if (!projectId) {
				throw new Error(`El ID del proyecto es obligatorio`);
			}

			const project = await projectRepository.getById(projectId);
			if (!project) {
				throw new Error(`Projecto con ID ${projectId} no encontrada`);
			}

			const statuses = await listRepository.getStatusesByProjectId(projectId);

			if (!statuses || statuses.length === 0) {
				return [];
			}

			return statuses;
		} catch (error) {
			throw new Error(
				`Error al obtener statuses por ID de proyecto: ${error.message}`
			);
		}
	};
}
