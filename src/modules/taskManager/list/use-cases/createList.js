export default function createList(listRepository) {
	return async function (listData) {
		try {
			if (!listData.name || !listData.parentId || !listData.parentType) {
				throw new Error(
					'El nombre de la lista, el ID del padre y el tipo de padre son obligatorios'
				);
			}

			if (!['project', 'folder'].includes(listData.parentType)) {
				throw new Error(
					'El tipo de padre debe ser workspace, project o folder'
				);
			}

			if (!listData.createdAt) {
				listData.createdAt = new Date().toISOString();
			}

			return await listRepository.create(listData);
		} catch (error) {
			throw new Error(`Error al crear lista: ${error.message}`);
		}
	};
}
