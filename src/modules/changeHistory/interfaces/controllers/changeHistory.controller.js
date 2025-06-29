import {
	getEntityHistoryParamsSchema,
	getUserActivityParamsSchema,
} from '../../infrastructure/schemas/changeHistory.schema.js';
import { getEntityHistory } from '../../use-cases/getEntityHistory.js';
import { getUserActivityHistory } from '../../use-cases/getUserActivityHistory.js';

export default function createChangeHistoryController(Repository) {
	const getEntityHistoryUseCase = getEntityHistory(Repository);
	const getUserActivityHistoryUseCase = getUserActivityHistory(Repository);

	return {
		async getEntityHistory(req, res) {
			try {
				const { entityType, entityId } = getEntityHistoryParamsSchema.parse(
					req.params
				);
				const { limit, offset, sortDirection } = req.query;

				const options = {
					limit: limit ? parseInt(limit, 10) : 100,
					offset: offset ? parseInt(offset, 10) : 0,
					sortDirection: sortDirection || 'DESC',
				};

				const history = await getEntityHistoryUseCase(
					entityType,
					parseInt(entityId, 10),
					options
				);

				return res.status(200).json(history);
			} catch (error) {
				return res.status(500).json({ error: error.message });
			}
		},

		async getUserActivity(req, res) {
			try {
				const { userId } = getUserActivityParamsSchema.parse(req.params);
				const { limit, offset, entityTypes } = req.query;

				const options = {
					limit: limit ? parseInt(limit, 10) : 100,
					offset: offset ? parseInt(offset, 10) : 0,
					entityTypes: entityTypes ? entityTypes.split(',') : null,
				};

				const history = await getUserActivityHistoryUseCase(userId, options);

				return res.status(200).json(history);
			} catch (error) {
				return res.status(500).json({ error: error.message });
			}
		},
	};
}
