export default function deleteFormById(formRepository) {
	return async function (id) {
		try {
			if (!id) {
				throw new Error(`El ID del formulario es obligatorio`);
			}
			return await formRepository.delete(id);
		} catch (error) {
			throw new Error(`Error al borrar el formulario: ${error.message}`);
		}
	};
}
