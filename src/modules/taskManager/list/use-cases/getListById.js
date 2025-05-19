export default function getListById(listRepository) {
	return async function (id) {
		try {
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
