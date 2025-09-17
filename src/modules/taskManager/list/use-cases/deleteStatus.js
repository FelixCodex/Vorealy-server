export default function deleteStatus(listRepository) {
	return async function (id) {
		try {
			const existingStatus = await listRepository.getStatusById(id);
			if (!existingStatus) {
				throw new Error(`Status con ID ${id} no encontrada`);
			}

			return await listRepository.deleteStatus(id);
		} catch (error) {
			throw new Error(`Error al eliminar status: ${error.message}`);
		}
	};
}
