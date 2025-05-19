export default function deleteFoldersByProjectId(folderRepository) {
	return async function (projectId) {
		try {
			return await folderRepository.deleteByProjectId(projectId);
		} catch (error) {
			throw new Error(
				`Error al eliminar carpetas por project ID: ${error.message}`
			);
		}
	};
}
