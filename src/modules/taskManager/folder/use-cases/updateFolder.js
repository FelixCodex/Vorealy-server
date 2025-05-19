export default function updateFolder(folderRepository) {
	return async function (id, folderData) {
		try {
			const existingFolder = await folderRepository.getById(id);
			if (!existingFolder) {
				throw new Error(`Carpeta con ID ${id} no encontrada`);
			}

			folderData.updatedAt = new Date().toISOString();

			const updatedFolder = await folderRepository.update({
				id,
				...folderData,
			});

			return updatedFolder;
		} catch (error) {
			throw new Error(`Error al actualizar carpeta: ${error.message}`);
		}
	};
}
