export default function getProjectsByWorkspaceId(projectRepository) {
	return async function (workspaceId) {
		try {
			const project = await projectRepository.getByWorkspaceId(workspaceId);
			if (!project) {
				throw new Error(`Proyecto con ID ${id} no encontrado`);
			}
			return project;
		} catch (error) {
			throw new Error(`Error al obtener proyecto por ID: ${error.message}`);
		}
	};
}
