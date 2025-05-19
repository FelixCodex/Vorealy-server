export default function getAllFolders(folderRepository) {
	return async function () {
		try {
			return await folderRepository.getAll();
		} catch (error) {
			throw new Error(`Error al obtener todas las carpetas: ${error.message}`);
		}
	};
}
