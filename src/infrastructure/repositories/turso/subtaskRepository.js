import { connect } from './connection.js';

class SubtaskRepositoryClass {
	constructor(connection) {
		this.connection = connection;
	}

	async getAll() {
		try {
			const { rows } = await this.connection.execute(
				`SELECT 
                    HEX(id) AS id, 
                    title, 
                    HEX(task_id) AS task_id, 
          			HEX(workspace_id) AS workspace_id, 
					completed,
					created_by,
					created_at,
					updated_at,
                    start_date, 
                    end_date, 
                    HEX(assigned_to) AS assigned_to, 
                    priority, 
                    estimated_time 
                FROM subtasks;`
			);
			return rows;
		} catch (err) {
			console.error('Error en SubtaskRepository.getAll:', err);
			throw err;
		}
	}

	async getById(id) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT 
                    HEX(id) AS id, 
                    title, 
                    HEX(task_id) AS task_id, 
          			HEX(workspace_id) AS workspace_id, 
					completed,
					created_by,
					created_at,
					updated_at,
                    start_date, 
                    end_date, 
                    HEX(assigned_to) AS assigned_to, 
                    priority, 
                    estimated_time 
                FROM subtasks 
                WHERE id = UNHEX(?);`,
				[id]
			);
			return rows[0] || null;
		} catch (err) {
			console.error('Error en SubtaskRepository.getById:', err);
			throw err;
		}
	}

	async getByTaskId(taskId) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT 
                    HEX(id) AS id, 
                    title, 
                    HEX(task_id) AS task_id, 
          			HEX(workspace_id) AS workspace_id, 
					completed,
					created_by,
					created_at,
					updated_at,
                    start_date, 
                    end_date, 
                    HEX(assigned_to) AS assigned_to, 
                    priority, 
                    estimated_time 
                FROM subtasks 
                WHERE task_id = UNHEX(?);`,
				[taskId]
			);
			return rows;
		} catch (err) {
			console.error('Error en SubtaskRepository.getByTaskId:', err);
			throw err;
		}
	}

	async getByAssignedTo(userId) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT 
                    HEX(id) AS id, 
                    title, 
                    HEX(task_id) AS task_id, 
          			HEX(workspace_id) AS workspace_id, 
					completed,
					created_by,
					created_at,
					updated_at,
                    start_date, 
                    end_date, 
                    HEX(assigned_to) AS assigned_to, 
                    priority, 
                    estimated_time 
                FROM subtasks 
                WHERE assigned_to = UNHEX(?);`,
				[userId]
			);
			return rows;
		} catch (err) {
			console.error('Error en SubtaskRepository.getByAssignedTo:', err);
			throw err;
		}
	}

	async create({
		id,
		title,
		taskId,
		workspaceId,
		createdBy,
		createdAt,
		updatedAt,
		startDate = null,
		endDate = null,
		assignedTo = null,
		priority = 'normal',
		estimatedTime = null,
	}) {
		const hexId = id.replace(/-/g, '');
		try {
			const { rows } = await this.connection.execute(
				`INSERT INTO subtasks(
                    id, 
                    title, 
                    task_id, 
           		 	workspace_id, 
					created_by,
					created_at,
					updated_at,
                    start_date, 
                    end_date, 
                    assigned_to, 
                    priority, 
                    estimated_time
                ) 
                VALUES(
                    UNHEX(?), 
                    ?, 
                    UNHEX(?), 
					UNHEX(?),
					UNHEX(?),
					?,
					?,
                    ?, 
                    ?, 
                    UNHEX(?), 
                    ?, 
                    ?
                ) 
                RETURNING 
                    HEX(id) AS id, 
                    title, 
                    HEX(task_id) AS task_id, 
          			HEX(workspace_id) AS workspace_id, 
					completed,
					created_by,
					created_at,
					updated_at,
                    start_date, 
                    end_date, 
                    HEX(assigned_to) AS assigned_to, 
                    priority, 
                    estimated_time;`,
				[
					hexId,
					title,
					taskId,
					workspaceId,
					createdBy,
					createdAt,
					updatedAt,
					startDate,
					endDate,
					assignedTo,
					priority,
					estimatedTime,
				]
			);
			return rows[0];
		} catch (err) {
			console.error('Error en SubtaskRepository.create:', err);
			throw err;
		}
	}

	async update({
		id,
		title = null,
		completed = null,
		startDate = null,
		endDate = null,
		assignedTo = null,
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
			if (completed !== null) {
				updates.push('completed = ?');
				values.push(completed);
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
			if (priority !== null) {
				updates.push('priority = ?');
				values.push(priority);
			}
			if (estimatedTime !== null) {
				updates.push('estimated_time = ?');
				values.push(estimatedTime);
			}

			if (updates.length === 0) {
				return null;
			}
			const now = new Date().toISOString();

			updates.push('updated_at = ?');
			values.push(now);

			values.push(id);

			const { rows } = await this.connection.execute(
				`UPDATE subtasks 
                SET ${updates.join(', ')} 
                WHERE id = UNHEX(?) 
                RETURNING 
                    HEX(id) AS id, 
                    title, 
                    HEX(task_id) AS task_id,
          			HEX(workspace_id) AS workspace_id,  
					completed,
					created_by,
					created_at,
					updated_at,
                    start_date, 
                    end_date, 
                    HEX(assigned_to) AS assigned_to, 
                    priority, 
                    estimated_time;`,
				values
			);
			return rows[0] || null;
		} catch (err) {
			console.error('Error en SubtaskRepository.update:', err);
			throw err;
		}
	}

	async delete(id) {
		try {
			await this.connection.execute(
				`DELETE FROM subtasks WHERE id = UNHEX(?);`,
				[id]
			);
			return { success: true, message: 'Subtarea eliminada correctamente' };
		} catch (err) {
			console.error('Error en SubtaskRepository.delete:', err);
			throw err;
		}
	}

	async deleteByTaskId(taskId) {
		try {
			await this.connection.execute(
				`DELETE FROM subtasks WHERE task_id = UNHEX(?);`,
				[taskId]
			);
			return { success: true, message: 'Subtareas eliminadas correctamente' };
		} catch (err) {
			console.error('Error en SubtaskRepository.deleteByTaskId:', err);
			throw err;
		}
	}
}
const SubtaskRepository = new SubtaskRepositoryClass(await connect());
export default SubtaskRepository;
