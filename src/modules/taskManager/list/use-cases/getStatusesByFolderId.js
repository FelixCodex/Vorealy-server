export function getStatusesByFolderId(listRepository, folderRepository) {
	return async function (folderId) {
		try {
			if (!folderId) {
				throw new Error(`El ID del folder es obligatorio`);
			}

			const folder = await folderRepository.getById(folderId);
			if (!folder) {
				throw new Error(`Fodler con ID ${folderId} no encontrada`);
			}

			const statuses = await listRepository.getStatusesByFolderId(folderId);

			if (!statuses || statuses.length === 0) {
				return [];
			}

			return statuses;
		} catch (error) {
			throw new Error(
				`Error al obtener statuses por ID de folder: ${error.message}`
			);
		}
	};
}
