export default function deleteFolder(folderRepository) {
	return async function (id) {
		try {
			const existingFolder = await folderRepository.getById(id);
			if (!existingFolder) {
				throw new Error(`Carpeta con ID ${id} no encontrada`);
			}

			return await folderRepository.delete(id);
		} catch (error) {
			throw new Error(`Error al eliminar carpeta: ${error.message}`);
		}
	};
}
