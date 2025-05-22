export class CustomPropertyService {
	constructor(Repository) {
		this.Repository = Repository;
	}

	async createCustomProperty(name, type, defaultValue, options) {
		try {
			const createCustomPropertyUseCase = createCustomProperty(this.Repository);
			const result = await createCustomPropertyUseCase.execute(
				name,
				type,
				defaultValue,
				options
			);

			return result;
		} catch (error) {
			throw error;
		}
	}

	async assignCustomProperty(
		definitionId,
		entityType,
		entityId,
		value,
		overrideParent
	) {
		try {
			const assignCustomPropertyUseCase = assignCustomProperty(this.Repository);
			const result = await assignCustomPropertyUseCase.execute(
				definitionId,
				entityType,
				entityId,
				value,
				overrideParent
			);

			return result;
		} catch (error) {
			throw error;
		}
	}

	async getEntityProperties(entityType, entityId, includeInherited) {
		try {
			const getEntityPropertiesUseCase = getEntityProperties(Repository);
			const properties = await getEntityPropertiesUseCase.execute(
				entityType,
				entityId,
				includeInherited
			);

			return properties;
		} catch (error) {
			throw error;
		}
	}
}
