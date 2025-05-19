export default function getAllLists(listRepository) {
	return async function () {
		try {
			return await listRepository.getAll();
		} catch (error) {
			throw new Error(`Error al obtener todas las listas: ${error.message}`);
		}
	};
}
