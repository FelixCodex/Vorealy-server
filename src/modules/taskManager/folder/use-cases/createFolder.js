export default function createFolder(folderRepository) {
	return async function (folderData) {
		try {
			if (!folderData.name || !folderData.projectId) {
				throw new Error(
					'El nombre de la carpeta y el ID del proyecto son obligatorios'
				);
			}

			if (!folderData.createdAt) {
				folderData.createdAt = new Date().toISOString();
			}
			if (!folderData.updatedAt) {
				folderData.updatedAt = folderData.createdAt;
			}

			return await folderRepository.create(folderData);
		} catch (error) {
			throw new Error(`Error al crear carpeta: ${error.message}`);
		}
	};
}
