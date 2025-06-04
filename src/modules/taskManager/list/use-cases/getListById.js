export default function getListById(listRepository) {
	return async function (id) {
		try {
			if (!id) {
				throw new Error(`El ID de la lista es obligatoria`);
			}
			const list = await listRepository.getById(id);
			if (!list) {
				throw new Error(`Lista con ID ${id} no encontrada`);
			}
			return list;
		} catch (error) {
			throw new Error(`Error al obtener lista por ID: ${error.message}`);
		}
	};
}
