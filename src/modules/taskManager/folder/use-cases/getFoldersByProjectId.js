export default function getFoldersByProjectId(
	folderRepository,
	projectRepository
) {
	return async function (projectId, workspaceId) {
		try {
			const project = await projectRepository.getById(projectId);
			if (!project) {
				throw new Error(`Proyecto no encontrado`);
			}
			console.log(project.workspace_id, workspaceId);
			if (project.workspace_id != workspaceId) {
				throw new Error(
					`No puedes ver las carpetas de un proyecto desde otro workspace`
				);
			}

			return await folderRepository.getByProjectId(projectId);
		} catch (error) {
			throw new Error(
				`Error al obtener carpetas por project ID: ${error.message}`
			);
		}
	};
}
