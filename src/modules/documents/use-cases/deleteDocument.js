export default function deleteDocument(documentRepository) {
	return async function (id) {
		try {
			const existingDoc = await documentRepository.getById(id);
			if (!existingDoc) {
				throw new Error(`Documento con ID ${id} no encontrado`);
			}

			return await listRepository.delete(id);
		} catch (error) {
			throw new Error(`Error al eliminar documento: ${error.message}`);
		}
	};
}
