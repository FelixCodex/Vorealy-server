export function createCustomProperty(customPropertyRepository) {
	return async function (name, type, defaultValue = null, options = null) {
		if (!name || !type) {
			throw new Error('El nombre de la propiedad y el tipo son obligatorios');
		}
		try {
			return await customPropertyRepository.createPropertyDefinition({
				name,
				type,
				defaultValue,
				options,
			});
		} catch (error) {
			throw new Error(`Error al crear propiedad: ${error.message}`);
		}
	};
}
