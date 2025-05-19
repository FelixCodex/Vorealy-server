export default function getFolderById(folderRepository) {
	return async function (id) {
		try {
			const folder = await folderRepository.getById(id);
			if (!folder) {
				throw new Error(`Carpeta con ID ${id} no encontrada`);
			}
			return folder;
		} catch (error) {
			throw new Error(`Error al obtener carpeta por ID: ${error.message}`);
		}
	};
}
