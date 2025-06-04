export default function updateDocument(documentRepository) {
	return async function (id, documentData) {
		try {
			const existingDoc = await documentRepository.getById(id);
			if (!existingDoc) {
				throw new Error(`Documento con ID ${id} no encontrado`);
			}

			const updatedList = await documentRepository.update({
				id,
				...documentData,
			});
			return updatedList;
		} catch (error) {
			throw new Error(`Error al actualizar documento: ${error.message}`);
		}
	};
}
