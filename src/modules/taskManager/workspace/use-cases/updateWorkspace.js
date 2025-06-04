export default function updateWorkSpace(workspaceRepository) {
	return async function ({ id, userId, name, color, icon_id }) {
		if (!id) {
			return res.status(400).json({ error: 'WorkspaceID required' });
		}
		const workspace = workspaceRepository.getById(id);
		if (!workspace) {
			return res.status(400).json({ error: 'Workspace not found' });
		}
		if (!userId) {
			return res.status(400).json({ error: 'UserId required' });
		}
		if (workspace.ownerId != userId) {
			return res.status(403).json({ error: 'User is not owner' });
		}

		const updatedWorkspace = await workspaceRepository.update(id, {
			name,
			color,
			icon_id,
		});

		return updatedWorkspace;
	};
}
