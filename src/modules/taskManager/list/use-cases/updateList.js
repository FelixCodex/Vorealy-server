export default function updateList(listRepository) {
	return async function (id, listData) {
		try {
			const existingList = await listRepository.getById(id);
			if (!existingList) {
				throw new Error(`Lista con ID ${id} no encontrada`);
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
