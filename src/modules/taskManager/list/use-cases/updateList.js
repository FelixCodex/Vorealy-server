export default function updateList(
	listRepository,
	projectRepository,
	folderRepository
) {
	return async function (id, listData) {
		try {
			const existingList = await listRepository.getById(id);
			if (!existingList) {
				throw new Error(`Lista con ID ${id} no encontrada`);
			}

			if (listData.parentId) {
				let parent;

				if (listData.parentType == 'project') {
					parent = await projectRepository.getById(listData.parentId);
					if (!parent) {
						throw new Error('Proyecto padre no encontrado');
					}
				} else if (listData.parentType == 'folder') {
					parent = await folderRepository.getById(listData.parentId);
					if (!parent) {
						throw new Error('Carpeta padre no encontrado');
					}
				} else {
					throw new Error(
						'El tipo del padre es requerido si se va a actualizar el padre'
					);
				}
			}

			const updatedList = await listRepository.update({
				id,
				...listData,
			});

			return updatedList;
		} catch (error) {
			throw new Error(`Error al actualizar lista: ${error.message}`);
		}
	};
}
