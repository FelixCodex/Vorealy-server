export default function deleteDocumentByParent(documentRepository) {
	return async function (parentId, parentType) {
		try {
			if (!parentId || !parentType) {
				throw new Error('El ID del padre y el tipo de padre son obligatorios');
			}

			return await documentRepository.deleteByParent(parentId, parentType);
		} catch (error) {
			throw new Error(
				`Error al eliminar documentos por padre: ${error.message}`
			);
		}
	};
}
