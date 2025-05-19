export default function deleteList(listRepository) {
	return async function (id) {
		try {
			const existingList = await listRepository.getById(id);
			if (!existingList) {
				throw new Error(`Lista con ID ${id} no encontrada`);
			}

			return await listRepository.delete(id);
		} catch (error) {
			throw new Error(`Error al eliminar lista: ${error.message}`);
		}
	};
}
