const ALLOWED_CHANGE_TYPES = ['create', 'update', 'delete'];

const ALLOWED_ENTITY_TYPES = [
	'workspace',
	'project',
	'folder',
	'list',
	'task',
	'custom_property',
];
export function recordChange(changeHistoryRepository) {
	return async function (
		entityType,
		entityId,
		changeType,
		userId,
		fieldName = null,
		oldValue = null,
		newValue = null,
		additionalInfo = null
	) {
		if (!entityType || !entityId) {
			throw new Error('El nombre de la entidad y el tipo son obligatorios');
		}
		if (!ALLOWED_ENTITY_TYPES.includes(entityType)) {
			throw new Error('El tipo de la entidad no es valido');
		}
		if (!changeType) {
			throw new Error('El tipo de cambio es obligatorio');
		}
		if (!ALLOWED_CHANGE_TYPES.includes(changeType)) {
			throw new Error(`El tipo de cambio no es valido`);
		}
		if (!userId) {
			throw new Error('El ID del usuario es obligatorio');
		}
		try {
			return changeHistoryRepository.recordChange({
				entityType,
				entityId,
				changeType,
				fieldName,
				oldValue,
				newValue,
				userId,
				timestamp: new Date(),
				additionalInfo,
			});
		} catch (error) {
			throw new Error(`Error al crear un registro: ${error.message}`);
		}
	};
}
