import { connect } from './connection.js';

const RETURNING = `id, name, description, HEX(workspace_id) as workspace_id, created_at, 
                    updated_at, HEX(created_by) as created_by, HEX(updated_by) as updated_by`;

class GoalsRepositoryClass {
	constructor(connection) {
		this.connection = connection;
	}

	async createGoal({
		id,
		name,
		description = null,
		workspaceId,
		createdBy,
		createdAt,
		updatedBy,
		updatedAt,
	}) {
		try {
			const { rows } = await this.connection.execute(
				`INSERT INTO goals (id, name, description, workspace_id, created_by, updated_by, created_at, updated_at) 
             VALUES (?, ?, ?, UNHEX(?), UNHEX(?), UNHEX(?), ?, ?)`,
				[
					id,
					name,
					description,
					workspaceId,
					createdBy,
					updatedBy,
					createdAt,
					updatedAt,
				]
			);
			return rows[0];
		} catch (err) {
			console.error('Error en GoalsRepository.createGoal:', err);
			throw err;
		}
	}

	async getGoalById(id) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT ${RETURNING}
                 FROM goals WHERE id = ?`,
				[id]
			);
			return rows[0] || null;
		} catch (err) {
			console.error('Error en GoalsRepository.getGoalById:', err);
			throw err;
		}
	}

	async getGoalsByWorkspaceId(workspaceId) {
		try {
			let query = `SELECT ${RETURNING}
                         FROM goals WHERE workspace_id = UNHEX(?) ORDER BY created_at DESC`;
			let params = [workspaceId];

			const { rows } = await this.connection.execute(query, params);
			return rows;
		} catch (err) {
			console.error('Error en GoalsRepository.getGoalsByWorkspaceId:', err);
			throw err;
		}
	}

	async updateGoal({ id, name, description, updatedBy, updatedAt }) {
		try {
			const updates = [];
			const values = [];

			if (name !== null) {
				updates.push('name = ?');
				values.push(name);
			}
			if (description !== null) {
				updates.push('description = ?');
				values.push(description);
			}

			if (updates.length === 0) return null;

			updates.push('updated_at = ?');
			values.push(updatedAt);

			updates.push('updated_by = UNHEX(?)');
			values.push(updatedBy);
			values.push(id);

			const { rows } = await this.connection.execute(
				`UPDATE goals 
                 SET ${updates.join(', ')}
                 WHERE id = ? RETURNING ${RETURNING}`,
				values
			);
			return rows.affectedRows > 0;
		} catch (err) {
			console.error('Error en GoalsRepository.updateGoal:', err);
			throw err;
		}
	}

	async deleteGoal(id) {
		try {
			const { rows } = await this.connection.execute(
				`DELETE FROM goals WHERE id = ?`,
				[id]
			);
			return rows.affectedRows > 0;
		} catch (err) {
			console.error('Error en GoalsRepository.completeGoal:', err);
			throw err;
		}
	}

	async createTarget({
		id,
		goalId,
		workspaceId,
		name,
		description = null,
		targetType = 'numeric',
		targetValue,
		unit = null,
		createdAt,
		updatedAt,
	}) {
		try {
			const { rows } = await this.connection.execute(
				`INSERT INTO targets (id, goal_id, workspace_id, name, description, target_type, target_value, unit,created_at,updated_at) 
                 VALUES (?, ?, UNHEX(?), ?, ?, ?, ?, ?, ?, ?)`,
				[
					id,
					goalId,
					workspaceId,
					name,
					description,
					targetType,
					targetValue,
					unit,
					createdAt,
					updatedAt,
				]
			);
			return rows[0];
		} catch (err) {
			console.error('Error en GoalsRepository.createTarget:', err);
			throw err;
		}
	}

	async getTargetsByGoalId(goalId) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT id, goal_id, name, description, target_type, target_value, 
                        current_value, unit, is_completed, completion_date, created_at, updated_at
                 FROM targets WHERE goal_id = ? ORDER BY created_at ASC`,
				[goalId]
			);
			return rows;
		} catch (err) {
			console.error('Error en GoalsRepository.getTargetsByGoalId:', err);
			throw err;
		}
	}

	async getTargetById(id) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT id, goal_id, name, description, target_type, target_value, 
                        current_value, unit, is_completed, completion_date, created_at, updated_at
                 FROM targets WHERE id = ? ORDER BY created_at ASC`,
				[id]
			);
			return rows;
		} catch (err) {
			console.error('Error en GoalsRepository.getTargetById:', err);
			throw err;
		}
	}

	async updateTargetProgress({ id, currentValue, updatedAt }) {
		try {
			const { rows } = await this.connection.execute(
				`UPDATE targets 
                 SET current_value = ?,
                     updated_at = ?
                 WHERE id = ?`,
				[currentValue, updatedAt, id]
			);
			return rows.affectedRows > 0;
		} catch (err) {
			console.error('Error en GoalsRepository.updateTargetProgress:', err);
			throw err;
		}
	}

	async deleteTarget(id) {
		try {
			const { rows } = await this.connection.execute(
				`DELETE FROM targets WHERE id = ?`,
				[id]
			);
			return rows.affectedRows > 0;
		} catch (err) {
			console.error('Error en GoalsRepository.completeGoal:', err);
			throw err;
		}
	}

	async recordProgress({
		id,
		goalId,
		targetId = null,
		previousValue = null,
		newValue,
		notes = null,
		recordedBy,
		recordedAt,
	}) {
		try {
			const { rows } = await this.connection.execute(
				`INSERT INTO goal_progress_history 
                 (id, goal_id, target_id, previous_value, new_value, notes, recorded_by,recorded_at) 
                 VALUES (?, ?, ?, ?, ?, ?, UNHEX(?),?)`,
				[
					id,
					goalId,
					targetId,
					previousValue,
					newValue,
					notes,
					recordedBy,
					recordedAt,
				]
			);
			return rows[0];
		} catch (err) {
			console.error('Error en GoalsRepository.recordProgress:', err);
			throw err;
		}
	}

	async getProgressHistory(goalId, limit = 50) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT id, goal_id, target_id, previous_value, new_value,
                        notes, HEX(recorded_by) as recorded_by, recorded_at
                 FROM goal_progress_history 
                 WHERE goal_id = ? 
                 ORDER BY recorded_at DESC 
                 LIMIT ?`,
				[goalId, limit]
			);
			return rows;
		} catch (err) {
			console.error('Error en GoalsRepository.getProgressHistory:', err);
			throw err;
		}
	}

	async getLinkByTaskIdAndTargetId(targetId, taskId) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT id, target_id, HEX(task_id) as task_id, 
                        is_active, created_at, HEX(created_by) as created_by
                 FROM target_tasks
                 WHERE target_id = ? AND task_id = UNHEX(?)
                 ORDER BY created_at ASC `,
				[targetId, taskId]
			);
			return rows[0];
		} catch (err) {
			console.error('Error en GoalsRepository.linkTaskToTarget:', err);
			throw err;
		}
	}

	async linkTaskToTarget({ id, targetId, taskId, createdBy, createdAt }) {
		try {
			const { rows } = await this.connection.execute(
				`INSERT INTO target_tasks (id, target_id, task_id, created_by,created_at) 
                 VALUES (?, ?, UNHEX(?), UNHEX(?),?)`,
				[id, targetId, taskId, createdBy, createdAt]
			);
			return rows[0];
		} catch (err) {
			console.error('Error en GoalsRepository.linkTaskToTarget:', err);
			throw err;
		}
	}

	async unlinkTaskFromTarget(targetId, taskId) {
		try {
			const { rows } = await this.connection.execute(
				`DELETE FROM target_tasks 
                 WHERE target_id = ? AND task_id = UNHEX(?)`,
				[targetId, taskId]
			);
			return rows.affectedRows > 0;
		} catch (err) {
			console.error('Error en GoalsRepository.unlinkTaskFromTarget:', err);
			throw err;
		}
	}

	async getTasksByTargetId(targetId) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT id, target_id, HEX(task_id) as task_id, 
                        is_active, created_at, HEX(created_by) as created_by
                 FROM target_tasks 
                 WHERE target_id = ?
                 ORDER BY created_at ASC`,
				[targetId]
			);
			return rows;
		} catch (err) {
			console.error('Error en GoalsRepository.getTasksByTargetId:', err);
			throw err;
		}
	}

	async getGoalWithTargetsAndProgress(goalId) {
		try {
			const goal = await this.getGoalById(goalId);
			if (!goal) return null;

			const targets = await this.getTargetsByGoalId(goalId);

			const progressHistory = await this.getProgressHistory(goalId, 10);

			const totalProgress =
				targets.length > 0
					? targets.reduce((sum, target) => {
							const targetProgress =
								target.target_value > 0
									? (target.current_value / target.target_value) * 100
									: 0;
							return sum + Math.min(targetProgress, 100);
					  }, 0) / targets.length
					: 0;

			return {
				...goal,
				targets,
				progressHistory,
				overallProgress: Math.round(totalProgress * 100) / 100,
			};
		} catch (err) {
			console.error(
				'Error en GoalsRepository.getGoalWithTargetsAndProgress:',
				err
			);
			throw err;
		}
	}
}

const GoalsRepository = new GoalsRepositoryClass(await connect());
export default GoalsRepository;
