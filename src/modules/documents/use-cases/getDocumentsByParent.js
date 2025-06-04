export default function getDocumentByParent(documentRepository) {
	return async function (parentType, parentId) {
		try {
			if (!parentId || !parentType) {
				throw new Error('El ID del padre y el tipo de padre son obligatorios');
			}
			if (['project', 'folder', 'list'].includes(parentType)) {
				throw new Error('El tipo del padre no es valido');
			}

			return documentRepository.getByParent(parentType, parentId);
		} catch (error) {
			throw new Error(
				`Error al obtener los documentos del elemento padre: ${error.message}`
			);
		}
	};
}
