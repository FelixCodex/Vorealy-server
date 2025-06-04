export default function getFormById(formRepository) {
	return async function (id) {
		try {
			if (!id) {
				throw new Error(`El ID del formulario es obligatorio`);
			}
			return await formRepository.getById(id);
		} catch (error) {
			throw new Error(`Error al obtener el formulario: ${error.message}`);
		}
	};
}
