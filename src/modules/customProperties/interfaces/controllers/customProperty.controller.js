import { assignCustomProperty } from '../../use-cases/assignCustomProperty';
import { createCustomProperty } from '../../use-cases/createCustomProperty';
import { getEntityProperties } from '../../use-cases/getEntityProperties';

export function createCustomPropertyController(Repository) {
	const createCustomPropertyUseCase = createCustomProperty(Repository);
	const assignCustomPropertyUseCase = assignCustomProperty(Repository);
	const getEntityPropertiesUseCase = getEntityProperties(Repository);

	return {
		async createCustomProperty(req, res) {
			try {
				const { name, type, defaultValue, options } = req.body;

				const result = await createCustomPropertyUseCase.execute(
					name,
					type,
					defaultValue,
					options
				);

				return res.status(201).json(result);
			} catch (error) {
				return res.status(500).json({ error: error.message });
			}
		},

		async assignCustomProperty(req, res) {
			try {
				const { definitionId, entityType, entityId, value, overrideParent } =
					req.body;

				const result = await assignCustomPropertyUseCase.execute(
					definitionId,
					entityType,
					entityId,
					value,
					overrideParent
				);

				return res.status(201).json(result);
			} catch (error) {
				return res.status(500).json({ error: error.message });
			}
		},

		async getEntityProperties(req, res) {
			try {
				const { entityType, entityId } = req.params;
				const includeInherited = req.query.includeInherited !== 'false';

				const properties = await getEntityPropertiesUseCase.execute(
					entityType,
					entityId,
					includeInherited
				);

				return res.status(200).json(properties);
			} catch (error) {
				return res.status(500).json({ error: error.message });
			}
		},
	};
}
