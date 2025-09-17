export default function getFoldersByWorkspaceId(folderRepository) {
	return async function (workspaceId) {
		try {
			return await folderRepository.getByWorkspaceId(workspaceId);
		} catch (error) {
			throw new Error(
				`Error al obtener carpetas por workspace: ${error.message}`
			);
		}
	};
}
