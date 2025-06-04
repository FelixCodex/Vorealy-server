export default function getDocumentById(documentRepository) {
	return async function (id) {
		try {
			if (!id) {
				throw new Error(`El ID del documento es obligatorio`);
			}
			const doc = await documentRepository.getById(id);
			if (!doc) {
				throw new Error(`Carpeta con ID ${id} no encontrada`);
			}
			return doc;
		} catch (error) {
			throw new Error(`Error al obtener todas las carpetas: ${error.message}`);
		}
	};
}
