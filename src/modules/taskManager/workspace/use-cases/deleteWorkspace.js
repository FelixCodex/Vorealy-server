export default function deleteWorkSpace(workspaceRepository) {
	return async function ({ id, userId }) {
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

		const result = await workspaceRepository.delete(id);
		return result;
	};
}
