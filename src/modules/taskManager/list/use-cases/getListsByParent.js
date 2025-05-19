export default function getListsByParent(listRepository) {
	return async function (parentId, parentType) {
		try {
			if (!parentId || !parentType) {
				throw new Error('El ID del padre y el tipo de padre son obligatorios');
			}

			return await listRepository.getByParent(parentId, parentType);
		} catch (error) {
			throw new Error(`Error al obtener listas por padre: ${error.message}`);
		}
	};
}
