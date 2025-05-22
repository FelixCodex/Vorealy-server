export function getEntityProperties(customPropertyRepository) {
	return async function (entityType, entityId, includeInherited = true) {
		if (!entityType || !entityId) {
			throw new Error('El el ID de la entidad y el tipo son obligatorios');
		}
		if (!includeInherited || typeof includeInherited !== 'boolean') {
			throw new Error('Incluir padre no es valido');
		}
		try {
			return customPropertyRepository.getEntityProperties(
				entityType,
				entityId,
				includeInherited
			);
		} catch (error) {
			throw new Error(`Error al crear propiedad: ${error.message}`);
		}
	};
}
