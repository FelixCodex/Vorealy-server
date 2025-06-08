import { connect } from './connection.js';

class ChangeHistoryRepositoryClass {
	constructor(connection) {
		this.connection = connection;
	}

	async recordChange({
		entityType,
		entityId,
		changeType,
		fieldName,
		oldValue,
		newValue,
		userId,
		timestamp,
		additionalInfo,
	}) {
		const result = await this.connection.execute(
			`INSERT INTO change_history 
       (entity_type, entity_id, change_type, field_name, old_value, new_value, user_id, timestamp, additional_info) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				entityType,
				entityId,
				changeType,
				fieldName,
				oldValue !== undefined ? JSON.stringify(oldValue) : null,
				newValue !== undefined ? JSON.stringify(newValue) : null,
				userId,
				timestamp.toISOString(),
				additionalInfo ? JSON.stringify(additionalInfo) : null,
			]
		);

		return { ...changeRecord, id: result.lastInsertRowid };
	}

	async getEntityHistory(entityType, entityId, options = {}) {
		const { limit = 100, offset = 0, sortDirection = 'DESC' } = options;

		const query = `
      SELECT ch.*, u.username as user_name
      FROM change_history ch
      LEFT JOIN users u ON ch.user_id = u.id
      WHERE ch.entity_type = ? AND ch.entity_id = ?
      ORDER BY ch.timestamp ${sortDirection === 'DESC' ? 'DESC' : 'ASC'}
      LIMIT ? OFFSET ?
    `;

		const history = await this.connection.execute(query, [
			entityType,
			entityId,
			limit,
			offset,
		]);

		return this._formatHistoryResults(history);
	}

	async getUserActivityHistory(userId, options = {}) {
		const {
			limit = 100,
			offset = 0,
			entityTypes = null,
			sortDirection = 'DESC',
		} = options;

		let query = `
      SELECT ch.*, u.username as user_name
      FROM change_history ch
      LEFT JOIN users u ON ch.user_id = u.id
      WHERE ch.user_id = ?
    `;

		const params = [userId];

		if (entityTypes && entityTypes.length > 0) {
			const placeholders = entityTypes.map(() => '?').join(',');
			query += ` AND ch.entity_type IN (${placeholders})`;
			params.push(...entityTypes);
		}

		query += `
      ORDER BY ch.timestamp ${sortDirection === 'DESC' ? 'DESC' : 'ASC'}
      LIMIT ? OFFSET ?
    `;

		params.push(limit, offset);

		const history = await this.connection.execute(query, params);

		return this._formatHistoryResults(history);
	}

	async getRecentChanges(options = {}) {
		const {
			limit = 100,
			offset = 0,
			entityTypes = null,
			userIds = null,
			startDate = null,
			endDate = null,
		} = options;

		let query = `
      SELECT ch.*, u.username as user_name
      FROM change_history ch
      LEFT JOIN users u ON ch.user_id = u.id
      WHERE 1=1
    `;

		const params = [];

		if (entityTypes && entityTypes.length > 0) {
			const placeholders = entityTypes.map(() => '?').join(',');
			query += ` AND ch.entity_type IN (${placeholders})`;
			params.push(...entityTypes);
		}

		if (userIds && userIds.length > 0) {
			const placeholders = userIds.map(() => '?').join(',');
			query += ` AND ch.user_id IN (${placeholders})`;
			params.push(...userIds);
		}

		if (startDate) {
			query += ` AND ch.timestamp >= ?`;
			params.push(startDate.toISOString());
		}

		if (endDate) {
			query += ` AND ch.timestamp <= ?`;
			params.push(endDate.toISOString());
		}

		query += `
            ORDER BY ch.timestamp DESC
            LIMIT ? OFFSET ?
            `;

		params.push(limit, offset);

		const history = await this.connection.execute(query, params);

		return this._formatHistoryResults(history);
	}

	_formatHistoryResults(results) {
		return results
			.map(row => {
				try {
					return {
						id: row.id,
						entityType: row.entity_type,
						entityId: row.entity_id,
						changeType: row.change_type,
						fieldName: row.field_name,
						oldValue: row.old_value ? JSON.parse(row.old_value) : null,
						newValue: row.new_value ? JSON.parse(row.new_value) : null,
						userId: row.user_id,
						userName: row.user_name,
						timestamp: new Date(row.timestamp),
						additionalInfo: row.additional_info
							? JSON.parse(row.additional_info)
							: null,
					};
				} catch (error) {
					console.error('Error parsing history row:', error, row);
					return null;
				}
			})
			.filter(Boolean);
	}
}

const ChangeHistoryRepository = new ChangeHistoryRepositoryClass(
	await connect()
);
export default ChangeHistoryRepository;
