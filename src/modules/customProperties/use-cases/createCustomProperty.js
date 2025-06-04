export function createCustomProperty(customPropertyRepository) {
	return async function (name, type, defaultValue = null, options = null) {
		if (!name || !type) {
			throw new Error('El nombre de la propiedad y el tipo son obligatorios');
		}
		try {
			const propertyDefinition = new CustomPropertyDefinition(
				null,
				name,
				type,
				defaultValue,
				options
			);
			return await customPropertyRepository.createPropertyDefinition(
				propertyDefinition
			);
		} catch (error) {
			throw new Error(`Error al crear propiedad: ${error.message}`);
		}
	};
}
