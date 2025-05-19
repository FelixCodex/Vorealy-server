export default class ListRepository {
	constructor(connection) {
		this.connection = connection;
	}

	async getAll() {
		try {
			const { rows } = await this.connection.execute(
				`SELECT 
          HEX(id) AS id, 
          name, 
          color,
          description, 
          HEX(parent_id) AS parent_id, 
          parent_type, 
          HEX(created_by) AS created_by, 
          created_at, 
          automation_rules, 
          HEX(assigned_to) AS assigned_to, 
          default_states, 
          statuses, 
          priority, 
          is_private, 
          estimated_time, 
          position 
        FROM lists;`
			);
			return rows;
		} catch (err) {
			console.error('Error en ListRepository.getAll:', err);
			throw err;
		}
	}

	async getById(id) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT 
          HEX(id) AS id, 
          name, 
          color,
          description, 
          HEX(parent_id) AS parent_id, 
          parent_type, 
          HEX(created_by) AS created_by, 
          created_at, 
          automation_rules, 
          HEX(assigned_to) AS assigned_to, 
          default_states, 
          statuses, 
          priority, 
          is_private, 
          estimated_time, 
          position 
        FROM lists 
        WHERE id = UNHEX(?);`,
				[id]
			);
			return rows[0] || null;
		} catch (err) {
			console.error('Error en ListRepository.getById:', err);
			throw err;
		}
	}

	async getByParent(parentId, parentType) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT 
          HEX(id) AS id, 
          name, 
          color,
          description, 
          HEX(parent_id) AS parent_id, 
          parent_type, 
          HEX(created_by) AS created_by, 
          created_at, 
          automation_rules, 
          HEX(assigned_to) AS assigned_to, 
          default_states, 
          statuses, 
          priority, 
          is_private, 
          estimated_time, 
          position 
        FROM lists 
        WHERE parent_id = UNHEX(?) AND parent_type = ? 
        ORDER BY position ASC;`,
				[parentId, parentType]
			);
			return rows;
		} catch (err) {
			console.error('Error en ListRepository.getByParent:', err);
			throw err;
		}
	}

	async create({
		id,
		name,
		color = '#808080',
		description = null,
		parentId,
		parentType = 'workspace',
		createdBy,
		createdAt,
		automationRules = null,
		assignedTo = null,
		defaultStates = '[{ "name": "TODO", "color": "#E74C3C" }, { "name": "Done", "color": "#F39C12" }]',
		statuses = null,
		priority = 'normal',
		isPrivate = false,
		estimatedTime = null,
		position = 0,
	}) {
		const hexId = id.replace(/-/g, '');
		try {
			const { rows } = await this.connection.execute(
				`INSERT INTO lists(
          id, 
          name, 
          color,
          description, 
          parent_id, 
          parent_type, 
          created_by, 
          created_at, 
          automation_rules, 
          assigned_to, 
          default_states, 
          statuses, 
          priority, 
          is_private, 
          estimated_time, 
          position
        ) VALUES(
          UNHEX(?), 
          ?, 
          ?,
          ?, 
          UNHEX(?), 
          ?, 
          UNHEX(?), 
          ?, 
          ?, 
          UNHEX(?), 
          ?, 
          ?, 
          ?, 
          ?, 
          ?, 
          ?
        ) RETURNING 
          HEX(id) AS id, 
          name, 
          color,
          description, 
          HEX(parent_id) AS parent_id, 
          parent_type, 
          HEX(created_by) AS created_by, 
          created_at, 
          automation_rules, 
          HEX(assigned_to) AS assigned_to, 
          default_states, 
          statuses, 
          priority, 
          is_private, 
          estimated_time, 
          position;`,
				[
					hexId,
					name,
					color,
					description,
					parentId,
					parentType,
					createdBy,
					createdAt,
					JSON.stringify(automationRules),
					assignedTo,
					defaultStates,
					JSON.stringify(statuses),
					priority,
					isPrivate,
					estimatedTime,
					position,
				]
			);
			return rows[0];
		} catch (err) {
			console.error('Error en ListRepository.create:', err);
			throw err;
		}
	}

	async update({
		id,
		name = null,
		color = null,
		description = null,
		assignedTo = null,
		automationRules = null,
		defaultStates = null,
		statuses = null,
		priority = null,
		isPrivate = null,
		estimatedTime = null,
		position = null,
	}) {
		try {
			// Construir la consulta SQL dinámicamente
			const updates = [];
			const values = [];

			if (name !== null) {
				updates.push('name = ?');
				values.push(name);
			}
			if (color !== null) {
				updates.push('color = ?');
				values.push(color);
			}
			if (description !== null) {
				updates.push('description = ?');
				values.push(description);
			}
			if (assignedTo !== null) {
				updates.push('assigned_to = UNHEX(?)');
				values.push(assignedTo);
			}
			if (automationRules !== null) {
				updates.push('automation_rules = ?');
				values.push(JSON.stringify(automationRules));
			}
			if (defaultStates !== null) {
				updates.push('default_states = ?');
				values.push(defaultStates);
			}
			if (statuses !== null) {
				updates.push('statuses = ?');
				values.push(JSON.stringify(statuses));
			}
			if (priority !== null) {
				updates.push('priority = ?');
				values.push(priority);
			}
			if (isPrivate !== null) {
				updates.push('is_private = ?');
				values.push(isPrivate);
			}
			if (estimatedTime !== null) {
				updates.push('estimated_time = ?');
				values.push(estimatedTime);
			}
			if (position !== null) {
				updates.push('position = ?');
				values.push(position);
			}

			if (updates.length === 0) {
				return null; // No hay nada que actualizar
			}

			values.push(id); // Para la condición WHERE id = UNHEX(?)

			const { rows } = await this.connection.execute(
				`UPDATE lists 
         SET ${updates.join(', ')} 
         WHERE id = UNHEX(?) 
         RETURNING 
           HEX(id) AS id, 
           name, 
           color,
           description, 
           HEX(parent_id) AS parent_id, 
           parent_type, 
           HEX(created_by) AS created_by, 
           created_at, 
           automation_rules, 
           HEX(assigned_to) AS assigned_to, 
           default_states, 
           statuses, 
           priority, 
           is_private, 
           estimated_time, 
           position;`,
				values
			);
			return rows[0] || null;
		} catch (err) {
			console.error('Error en ListRepository.update:', err);
			throw err;
		}
	}

	async updatePositions(positionUpdates) {
		try {
			// positionUpdates debe ser un array de objetos { id, position }
			const promises = positionUpdates.map(item => {
				return this.connection.execute(
					`UPDATE lists SET position = ? WHERE id = UNHEX(?);`,
					[item.position, item.id]
				);
			});

			await Promise.all(promises);
			return {
				success: true,
				message: 'Posiciones actualizadas correctamente',
			};
		} catch (err) {
			console.error('Error en ListRepository.updatePositions:', err);
			throw err;
		}
	}

	async delete(id) {
		try {
			await this.connection.execute(`DELETE FROM lists WHERE id = UNHEX(?);`, [
				id,
			]);
			return { success: true, message: 'Lista eliminada correctamente' };
		} catch (err) {
			console.error('Error en ListRepository.delete:', err);
			throw err;
		}
	}

	async deleteByParent(parentId, parentType) {
		try {
			await this.connection.execute(
				`DELETE FROM lists WHERE parent_id = UNHEX(?) AND parent_type = ?;`,
				[parentId, parentType]
			);
			return { success: true, message: 'Listas eliminadas correctamente' };
		} catch (err) {
			console.error('Error en ListRepository.deleteByParent:', err);
			throw err;
		}
	}
}
