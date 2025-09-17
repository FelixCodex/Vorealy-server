import { connect } from './connection.js';

const RETURNING = `HEX(id) AS id, name, color,description, HEX(parent_id) AS parent_id,
					HEX(workspace_id) AS workspace_id, parent_type, HEX(created_by) AS created_by, 
					created_at, updated_at, automation_rules, priority, is_private, 
					estimated_time, todo_color, todo_name, done_name`;

class ListRepositoryClass {
	constructor(connection) {
		this.connection = connection;
	}

	async getAll() {
		try {
			const { rows } = await this.connection.execute(
				`SELECT ${RETURNING} FROM lists;`
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
				`SELECT ${RETURNING}
        		FROM lists 
        		WHERE id = UNHEX(?);`,
				[id]
			);
			const row = rows[0];
			return row;
		} catch (err) {
			console.error('Error en ListRepository.getById:', err);
			throw err;
		}
	}

	async getByParent(parentId, parentType) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT ${RETURNING}
        		FROM lists 
        		WHERE parent_id = UNHEX(?) AND parent_type = ?;`,
				[parentId, parentType]
			);
			return rows;
		} catch (err) {
			console.error('Error en ListRepository.getByParent:', err);
			throw err;
		}
	}

	async getByWorkspaceId(workspaceId) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT ${RETURNING} FROM lists 
        		WHERE workspace_id = UNHEX(?);`,
				[workspaceId]
			);
			return rows;
		} catch (err) {
			console.error('Error en ListsRepository.getByWorkspaceId:', err);
			throw err;
		}
	}

	async create({
		id,
		name,
		color = '#808080',
		description = null,
		parentId,
		workspaceId,
		parentType = 'workspace',
		createdBy,
		createdAt,
		updatedAt,
		automationRules = null,
		priority = 'normal',
		isPrivate = false,
		estimatedTime = null,
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
		  workspace_id, 
          parent_type, 
          created_by, 
          created_at, 
          updated_at, 
          automation_rules, 
          priority, 
          is_private, 
          estimated_time
        ) VALUES(
          UNHEX(?), 
          ?, 
          ?,
          ?, 
          UNHEX(?),
		  UNHEX(?), 
          ?, 
          UNHEX(?), 
          ?, 
          ?, 
		  ?,
          ?, 
          ?,
		  ?
        ) RETURNING ${RETURNING};`,
				[
					hexId,
					name,
					color,
					description,
					parentId,
					workspaceId,
					parentType,
					createdBy,
					createdAt,
					updatedAt,
					JSON.stringify(automationRules),
					priority,
					isPrivate,
					estimatedTime,
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
		automationRules = null,
		todoColor = null,
		todoName = null,
		doneName = null,
		priority = null,
		isPrivate = null,
		estimatedTime = null,
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
			if (automationRules !== null) {
				updates.push('automation_rules = ?');
				values.push(JSON.stringify(automationRules));
			}
			if (todoColor !== null) {
				updates.push('todo_color = ?');
				values.push(JSON.stringify(todoColor));
			}
			if (todoName !== null) {
				updates.push('todo_name = ?');
				values.push(JSON.stringify(todoName));
			}
			if (doneName !== null) {
				updates.push('done_name = ?');
				values.push(JSON.stringify(doneName));
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

			if (updates.length === 0) {
				return null; // No hay nada que actualizar
			}
			const now = new Date().toISOString();

			updates.push('updated_at = ?');
			values.push(now);

			values.push(id); // Para la condición WHERE id = UNHEX(?)

			const { rows } = await this.connection.execute(
				`UPDATE lists 
         		SET ${updates.join(', ')} 
         		WHERE id = UNHEX(?) 
         		RETURNING ${RETURNING};`,
				values
			);
			const row = rows[0] || null;
			return row;
		} catch (err) {
			console.error('Error en ListRepository.update:', err);
			throw err;
		}
	}

	async changeParent({ id, parentId, parentType, now }) {
		try {
			if (['project', 'folder'].includes(parentType)) {
			}

			const { rows } = await this.connection.execute(
				`UPDATE lists 
         SET parent_id = UNHEX(?), parent_type = ?, updated_at = ?
         WHERE id = UNHEX(?) 
         RETURNING ${RETURNING};`,
				[parentId, parentType, now, id]
			);
			const row = rows[0];
			return row;
		} catch (err) {
			console.error('Error en ListRepository.update:', err);
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

	/**
	 * Obtiene todos los estatus de una lista específica
	 * @param {string} listId - ID de la lista
	 * @returns {Promise<Array>} Array de estatus
	 */
	async getStatusesByListId(listId) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT 
					HEX(id) as id,
					HEX(list_id) as list_id,
					name,
					color,
					created_at,
					HEX(created_by) as created_by,
					updated_at,
					HEX(updated_by) as updated_by
				FROM list_statuses 
				WHERE list_id = UNHEX(?) 
				ORDER BY updated_at ASC;`,
				[listId]
			);
			return rows;
		} catch (err) {
			console.error('Error en ListRepository.getStatusesByListId:', err);
			throw err;
		}
	}

	async getStatusesByProjectId(projectId) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT
          HEX(s.id) AS id,
          HEX(s.list_id) AS list_id,
          HEX(s.created_by) AS created_by,
		  s.name,
		  s.color,
		  s.created_at,
		  s.updated_at,
		  HEX(s.updated_by) as updated_by
        FROM list_statuses s
        INNER JOIN lists l ON s.list_id = l.id
        LEFT JOIN folders f ON l.parent_id = f.id AND l.parent_type = 'folder'
        WHERE 
          (l.parent_type = 'project' AND l.parent_id = UNHEX(?))
          OR 
          (l.parent_type = 'folder' AND f.project_id = UNHEX(?))
        ORDER BY s.created_at DESC;`,
				[projectId, projectId]
			);
			return rows;
		} catch (err) {
			console.error('Error en TaskRepository.getByProjectId:', err);
			throw err;
		}
	}

	async getStatusesByFolderId(folderId) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT
          HEX(s.id) AS id,
          HEX(s.list_id) AS list_id,
          HEX(s.created_by) AS created_by,
		  s.name,
		  s.color,
		  s.created_at,
		  s.updated_at,
		  HEX(s.updated_by) as updated_by
        FROM list_statuses s
        INNER JOIN lists l ON s.list_id = l.id
        WHERE l.parent_type = 'folder' AND l.parent_id = UNHEX(?)
        ORDER BY s.created_at DESC;`,
				[folderId]
			);
			return rows;
		} catch (err) {
			console.error('Error en TaskRepository.getByFolderId:', err);
			throw err;
		}
	}

	async getStatusById(statusId) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT 
					HEX(id) as id,
					HEX(list_id) as list_id,
					name,
					color,
					created_at,
					HEX(created_by) as created_by,
					updated_at,
					HEX(updated_by) as updated_by
				FROM list_statuses 
				WHERE id = UNHEX(?);`,
				[statusId]
			);
			return rows[0] || null;
		} catch (err) {
			console.error('Error en ListRepository.getStatusById:', err);
			throw err;
		}
	}

	async createStatus({
		id,
		listId,
		name,
		color = '#808080',
		createdBy,
		createdAt = new Date().toISOString(),
	}) {
		try {
			const hexId = id.replace(/-/g, '');

			const { rows } = await this.connection.execute(
				`INSERT INTO list_statuses(
					id, 
					list_id, 
					name, 
					color, 
					created_by, 
					created_at,
					updated_at,
					updated_by
				) VALUES(
					UNHEX(?), 
					UNHEX(?), 
					?, 
					?, 
					UNHEX(?), 
					?, 
					?,
					UNHEX(?)
				) RETURNING 
					HEX(id) as id,
					HEX(list_id) as list_id,
					name,
					color,
					created_at,
					HEX(created_by) as created_by,
					updated_at,
					HEX(updated_by) as updated_by;`,
				[hexId, listId, name, color, createdBy, createdAt, createdAt, createdBy]
			);
			return rows[0];
		} catch (err) {
			console.error('Error en ListRepository.createStatus:', err);
			throw err;
		}
	}

	async updateStatus({ id, name = null, color = null, updatedBy, updatedAt }) {
		try {
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

			if (updates.length === 0) {
				return null; // No hay nada que actualizar
			}

			updates.push('updated_by = UNHEX(?)');
			values.push(updatedBy);

			const now = updatedAt ? updatedAt : new Date().toISOString();
			updates.push('updated_at = ?');
			values.push(now);

			values.push(id); // Para la condición WHERE

			const { rows } = await this.connection.execute(
				`UPDATE list_statuses 
				SET ${updates.join(', ')} 
				WHERE id = UNHEX(?) 
				RETURNING 
					HEX(id) as id,
					HEX(list_id) as list_id,
					name,
					color,
					created_at,
					HEX(created_by) as created_by,
					updated_at,
					HEX(updated_by) as updated_by;`,
				values
			);
			return rows[0] || null;
		} catch (err) {
			console.error('Error en ListRepository.updateStatus:', err);
			throw err;
		}
	}

	async deleteStatus(statusId) {
		try {
			const { rowsAffected } = await this.connection.execute(
				`DELETE FROM list_statuses WHERE id = UNHEX(?);`,
				[statusId]
			);

			if (rowsAffected === 0) {
				return { success: false, message: 'Estatus no encontrado' };
			}

			return { success: true, message: 'Estatus eliminado correctamente' };
		} catch (err) {
			console.error('Error en ListRepository.deleteStatus:', err);
			throw err;
		}
	}
}

const ListRepository = new ListRepositoryClass(await connect());

export default ListRepository;
