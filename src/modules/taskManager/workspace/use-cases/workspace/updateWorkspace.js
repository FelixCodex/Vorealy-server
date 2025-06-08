export default function updateWorkSpace(workspaceRepository) {
	return async function ({ id, name, color, icon_id }) {
		try {
			if (!id) {
				throw new Error(`WorkspaceID required`);
			}
			const workspace = await workspaceRepository.getById(id);
			if (!workspace) {
				throw new Error(`Workspace not found`);
			}

			const updatedWorkspace = await workspaceRepository.update(id, {
				name,
				color,
				icon_id,
			});

			return updatedWorkspace;
		} catch (error) {
			throw new Error(`Error al actualizar el workspace: ${error.message}`);
		}
	};
}
