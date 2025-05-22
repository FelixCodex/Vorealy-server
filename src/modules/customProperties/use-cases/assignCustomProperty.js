export function assignCustomProperty(customPropertyRepository) {
	return async function (
		definitionId,
		entityType,
		entityId,
		value,
		overrideParent = false
	) {
		if (!definitionId || !entityType || !entityId) {
			throw new Error(
				'El ID de la propiedad, el tipo y el ID de la entidad son obligatorios'
			);
		}
		if (!value) {
			throw new Error('El valor es obligatorios');
		}
		if (!overrideParent || typeof overrideParent !== 'boolean') {
			throw new Error('Sobreescribir no es valido');
		}

		try {
			const assignment = {
				definitionId,
				entityType,
				entityId,
				value,
				isInherited: false,
				overrideParent,
				parentEntityType: null,
				parentEntityId: null,
			};
			return customPropertyRepository.assignProperty(assignment);
		} catch (error) {
			throw new Error(
				`Error al crear asignacion de propiedad: ${error.message}`
			);
		}
	};
}
