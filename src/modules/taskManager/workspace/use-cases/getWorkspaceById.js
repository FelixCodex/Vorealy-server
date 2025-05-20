export default function getWorkspaceById(workspaceRepository) {
	return async function (id) {
		try {
			const workspace = await workspaceRepository.getById(id);
			if (!workspace) {
				throw new Error('Workspace no encontrado');
			}
			return workspace;
		} catch (error) {
			throw new Error(`Error al obtener el workspace: ${id}`);
		}
	};
}
