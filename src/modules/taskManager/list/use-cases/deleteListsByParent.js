export default function deleteListsByParent(listRepository) {
	return async function (parentId, parentType) {
		try {
			if (!parentId || !parentType) {
				throw new Error('El ID del padre y el tipo de padre son obligatorios');
			}

			return await listRepository.deleteByParent(parentId, parentType);
		} catch (error) {
			throw new Error(`Error al eliminar listas por padre: ${error.message}`);
		}
	};
}
