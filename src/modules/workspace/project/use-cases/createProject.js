export default function createProject(projectRepository) {
	return async function (projectData) {
		try {
			if (!projectData.name || !projectData.workspaceId) {
				throw new Error(
					'El nombre del proyecto y el ID del workspace son obligatorios'
				);
			}

			if (!projectData.createdAt) {
				projectData.createdAt = new Date().toISOString();
			}
			if (!projectData.updatedAt) {
				projectData.updatedAt = projectData.createdAt;
			}

			return await projectRepository.create(projectData);
		} catch (error) {
			throw new Error(`Error al crear proyecto: ${error.message}`);
		}
	};
}
