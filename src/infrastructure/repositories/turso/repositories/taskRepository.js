export default class TaskRepository {
	constructor(connection) {
		this.connection = connection;
	}

	async getAll() {
		try {
			const { rows } = await this.connection.execute(
				`SELECT 
          HEX(id) AS id, 
          title, 
          HEX(list_id) AS list_id, 
          HEX(workspace_id) AS workspace_id, 
          HEX(created_by) AS created_by, 
          created_at, 
          start_date, 
          end_date, 
          HEX(assigned_to) AS assigned_to, 
          state, 
          priority, 
          estimated_time 
        FROM tasks;`
			);
			return rows;
		} catch (err) {
			console.error('Error en TaskRepository.getAll:', err);
			throw err;
		}
	}

	async getById(id) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT 
          HEX(id) AS id, 
          title, 
          HEX(list_id) AS list_id, 
          HEX(workspace_id) AS workspace_id, 
          HEX(created_by) AS created_by, 
          created_at, 
          start_date, 
          end_date, 
          HEX(assigned_to) AS assigned_to, 
          state, 
          priority, 
          estimated_time 
        FROM tasks 
        WHERE id = UNHEX(?);`,
				[id]
			);
			return rows[0] || null;
		} catch (err) {
			console.error('Error en TaskRepository.getById:', err);
			throw err;
		}
	}

	async getByListId(listId) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT 
          HEX(id) AS id, 
          title, 
          HEX(list_id) AS list_id, 
          HEX(workspace_id) AS workspace_id, 
          HEX(created_by) AS created_by, 
          created_at, 
          start_date, 
          end_date, 
          HEX(assigned_to) AS assigned_to, 
          state, 
          priority, 
          estimated_time 
        FROM tasks 
        WHERE list_id = UNHEX(?);`,
				[listId]
			);
			return rows;
		} catch (err) {
			console.error('Error en TaskRepository.getByListId:', err);
			throw err;
		}
	}

	async getByAssignedTo(userId) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT 
          HEX(id) AS id, 
          title, 
          HEX(list_id) AS list_id, 
          HEX(workspace_id) AS workspace_id, 
          HEX(created_by) AS created_by, 
          created_at, 
          start_date, 
          end_date, 
          HEX(assigned_to) AS assigned_to, 
          state, 
          priority, 
          estimated_time 
        FROM tasks 
        WHERE assigned_to = UNHEX(?);`,
				[userId]
			);
			return rows;
		} catch (err) {
			console.error('Error en TaskRepository.getByAssignedTo:', err);
			throw err;
		}
	}

	async create({
		id,
		title,
		workspaceId,
		listId,
		createdBy,
		createdAt,
		startDate = null,
		endDate = null,
		assignedTo = null,
		state = 'todo',
		priority = 'normal',
		estimatedTime = null,
	}) {
		const hexId = id.replace(/-/g, '');
		try {
			const { rows } = await this.connection.execute(
				`INSERT INTO tasks(
          id, 
          title, 
          list_id, 
          workspace_id, 
          created_by, 
          created_at, 
          start_date, 
          end_date, 
          assigned_to, 
          state, 
          priority, 
          estimated_time
        ) VALUES(
          UNHEX(?), 
          ?, 
          UNHEX(?), 
		  UNHEX(?)
          UNHEX(?), 
          ?, 
          ?, 
          ?, 
          UNHEX(?), 
          ?, 
          ?, 
          ?
        ) RETURNING 
          HEX(id) AS id, 
          title, 
          HEX(list_id) AS list_id, 
          HEX(created_by) AS created_by, 
          created_at, 
          start_date, 
          end_date, 
          HEX(assigned_to) AS assigned_to, 
          state, 
          priority, 
          estimated_time;`,
				[
					hexId,
					title,
					listId,
					workspaceId,
					createdBy,
					createdAt,
					startDate,
					endDate,
					assignedTo,
					state,
					priority,
					estimatedTime,
				]
			);
			return rows[0];
		} catch (err) {
			console.error('Error en TaskRepository.create:', err);
			throw err;
		}
	}

	async update({
		id,
		title = null,
		startDate = null,
		endDate = null,
		assignedTo = null,
		state = null,
		priority = null,
		estimatedTime = null,
	}) {
		try {
			// Construir la consulta SQL dinámicamente
			const updates = [];
			const values = [];

			if (title !== null) {
				updates.push('title = ?');
				values.push(title);
			}
			if (startDate !== null) {
				updates.push('start_date = ?');
				values.push(startDate);
			}
			if (endDate !== null) {
				updates.push('end_date = ?');
				values.push(endDate);
			}
			if (assignedTo !== null) {
				updates.push('assigned_to = UNHEX(?)');
				values.push(assignedTo);
			}
			if (state !== null) {
				updates.push('state = ?');
				values.push(state);
			}
			if (priority !== null) {
				updates.push('priority = ?');
				values.push(priority);
			}
			if (estimatedTime !== null) {
				updates.push('estimated_time = ?');
				values.push(estimatedTime);
			}

			if (updates.length === 0) {
				return null; // No hay nada que actualizar
			}

			values.push(id); // Para la condición WHERE id = UNHEX(?)

			const { rows } = await this.connection.execute(
				`UPDATE tasks 
         SET ${updates.join(', ')} 
         WHERE id = UNHEX(?) 
         RETURNING 
           HEX(id) AS id, 
           title, 
           HEX(list_id) AS list_id, 
          HEX(workspace_id) AS workspace_id, 
           HEX(created_by) AS created_by, 
           created_at, 
           start_date, 
           end_date, 
           HEX(assigned_to) AS assigned_to, 
           state, 
           priority, 
           estimated_time;`,
				values
			);
			return rows[0] || null;
		} catch (err) {
			console.error('Error en TaskRepository.update:', err);
			throw err;
		}
	}

	async changeList(taskId, newListId) {
		try {
			const { rows } = await this.connection.execute(
				`UPDATE tasks 
         SET list_id = UNHEX(?) 
         WHERE id = UNHEX(?) 
         RETURNING 
           HEX(id) AS id, 
           title, 
           HEX(list_id) AS list_id, 
          HEX(workspace_id) AS workspace_id, 
           HEX(created_by) AS created_by, 
           created_at, 
           start_date, 
           end_date, 
           HEX(assigned_to) AS assigned_to, 
           state, 
           priority, 
           estimated_time;`,
				[newListId, taskId]
			);
			return rows[0] || null;
		} catch (err) {
			console.error('Error en TaskRepository.changeList:', err);
			throw err;
		}
	}

	async delete(id) {
		try {
			await this.connection.execute(`DELETE FROM tasks WHERE id = UNHEX(?);`, [
				id,
			]);
			return { success: true, message: 'Tarea eliminada correctamente' };
		} catch (err) {
			console.error('Error en TaskRepository.delete:', err);
			throw err;
		}
	}

	async deleteByListId(listId) {
		try {
			await this.connection.execute(
				`DELETE FROM tasks WHERE list_id = UNHEX(?);`,
				[listId]
			);
			return { success: true, message: 'Tareas eliminadas correctamente' };
		} catch (err) {
			console.error('Error en TaskRepository.deleteByListId:', err);
			throw err;
		}
	}
}
