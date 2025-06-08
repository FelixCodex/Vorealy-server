export default function deleteWorkSpace(workspaceRepository) {
	return async function (id) {
		if (!id) {
			return res.status(400).json({ error: 'WorkspaceID required' });
		}

		const result = await workspaceRepository.delete(id);
		return result;
	};
}
