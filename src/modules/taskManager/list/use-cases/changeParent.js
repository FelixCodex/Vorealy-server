import { getDateNow } from '../../../../shared/utils/utils.js';

export default function changeParent(
	listRepository,
	projectRepository,
	folderRepository
) {
	return async function (id, parentId, parentType, workspaceId) {
		try {
			const existingList = await listRepository.getById(id);
			if (!existingList) {
				throw new Error(`Lista con ID ${id} no encontrada`);
			}
			console.log(parentId);

			const now = getDateNow();

			let parent;

			if (parentType == 'project') {
				parent = await projectRepository.getById(parentId);
				if (!parent) {
					throw new Error('Proyecto padre no encontrado');
				}
			} else if (parentType == 'folder') {
				parent = await folderRepository.getById(parentId);
				if (!parent) {
					throw new Error('Carpeta padre no encontrado');
				}
			} else {
				throw new Error(
					'El tipo del padre es requerido si se va a actualizar el padre'
				);
			}

			const updatedList = await listRepository.changeParent({
				id,
				parentId,
				parentType,
				now,
			});

			return updatedList;
		} catch (error) {
			throw new Error(`Error al actualizar lista: ${error.message}`);
		}
	};
}
