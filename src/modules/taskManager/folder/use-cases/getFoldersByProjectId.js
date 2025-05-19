export default function getFoldersByProjectId(folderRepository) {
	return async function (projectId) {
		try {
			return await folderRepository.getByProjectId(projectId);
		} catch (error) {
			throw new Error(
				`Error al obtener carpetas por project ID: ${error.message}`
			);
		}
	};
}
