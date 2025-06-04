export default function getAllDocuments(documentRepository) {
	return async function () {
		try {
			return await documentRepository.getAll();
		} catch (error) {
			throw new Error(`Error al obtener todas las carpetas: ${error.message}`);
		}
	};
}
