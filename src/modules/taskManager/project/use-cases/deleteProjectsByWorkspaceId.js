export default function deleteProjectsByWorkspaceId(projectRepository) {
	return async function (workspaceId) {
		try {
			return await projectRepository.deleteByWorkspaceId(workspaceId);
		} catch (error) {
			throw new Error(
				`Error al eliminar proyectos por workspace ID: ${error.message}`
			);
		}
	};
}
