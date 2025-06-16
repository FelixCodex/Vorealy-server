export default function getProjectsByWorkspaceId(projectRepository) {
	return async function (workspaceId) {
		try {
			const project = await projectRepository.getByWorkspaceId(workspaceId);
			return project;
		} catch (error) {
			throw new Error(`Error al obtener proyecto por ID: ${error.message}`);
		}
	};
}
