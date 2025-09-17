import { connect } from './connection.js';

const RETURNING = `HEX(id) as id, HEX(user_id) as user_id, HEX(workspace_id) as workspace_id,
                parent_type as parent_type, HEX(parent_id) as parent_id,assigned_at as assigned_at, 
                HEX(assigned_by) as assigned_by`;

class WorkspaceAssignationRepositoryClass {
	constructor(connection) {
		this.connection = connection;
	}

	async create({
		id,
		userId,
		workspaceId,
		parentType,
		parentId,
		assignedBy,
		assignedAt,
	}) {
		try {
			const { rows } = await this.connection.execute(
				`INSERT INTO workspace_assignation 
                 (id, user_id, workspace_id, parent_type, parent_id, assigned_by,assigned_at)
                 VALUES (UNHEX(?), UNHEX(?), UNHEX(?), ?, UNHEX(?), UNHEX(?))
                 RETURNING ${RETURNING}`,
				[id, userId, workspaceId, parentType, parentId, assignedBy, assignedAt]
			);

			return rows[0];
		} catch (err) {
			console.error('Error en WorkspaceAssignationRepository.create:', err);
			throw err;
		}
	}

	async findById(id) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT ${RETURNING}
                 FROM workspace_assignation 
                 WHERE id = UNHEX(?)`,
				[id]
			);
			return rows[0] || null;
		} catch (err) {
			console.error('Error en WorkspaceAssignationRepository.findById:', err);
			throw err;
		}
	}

	async findByWorkspace(workspaceId, { limit = 50, offset = 0 } = {}) {
		try {
			limit = Math.min(limit, 100);
			offset = Math.max(offset, 0);

			const { rows } = await this.connection.execute(
				`SELECT HEX(wa.id) as id, HEX(wa.user_id) as userId, HEX(wa.workspace_id) as workspaceId,
                        wa.parent_type as parentType, HEX(wa.parent_id) as parentId,
                        wa.assigned_at as assignedAt, HEX(wa.assigned_by) as assignedBy,
                        u.name as userName, u.email as userEmail
                 FROM workspace_assignation wa
                 JOIN users u ON wa.user_id = u.id
                 WHERE wa.workspace_id = UNHEX(?)
                 ORDER BY wa.assigned_at DESC
                 LIMIT ? OFFSET ?`,
				[workspaceId, limit, offset]
			);
			return rows;
		} catch (err) {
			console.error(
				'Error en WorkspaceAssignationRepository.findByWorkspace:',
				err
			);
			throw err;
		}
	}

	async findByUser(userId, workspaceId = null) {
		try {
			let query = `SELECT HEX(wa.id) as id, HEX(wa.user_id) as userId, HEX(wa.workspace_id) as workspaceId,
                                wa.parent_type as parentType, HEX(wa.parent_id) as parentId,
                                wa.assigned_at as assignedAt, HEX(wa.assigned_by) as assignedBy,
                                w.name as workspaceName
                         FROM workspace_assignation wa
                         JOIN workspaces w ON wa.workspace_id = w.id
                         WHERE wa.user_id = UNHEX(?)`;

			const params = [userId];

			if (workspaceId) {
				query += ` AND wa.workspace_id = UNHEX(?)`;
				params.push(workspaceId);
			}

			query += ` ORDER BY wa.assigned_at DESC`;

			const { rows } = await this.connection.execute(query, params);
			return rows;
		} catch (err) {
			console.error('Error en WorkspaceAssignationRepository.findByUser:', err);
			throw err;
		}
	}

	async findByParent(parentType, parentId) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT HEX(wa.id) as id, HEX(wa.user_id) as userId, HEX(wa.workspace_id) as workspaceId,
                        wa.parent_type as parentType, HEX(wa.parent_id) as parentId,
                        wa.assigned_at as assignedAt, HEX(wa.assigned_by) as assignedBy,
                        u.name as userName, u.email as userEmail
                 FROM workspace_assignation wa
                 JOIN users u ON wa.user_id = u.id
                 WHERE wa.parent_type = ? AND wa.parent_id = UNHEX(?)
                 ORDER BY wa.assigned_at DESC`,
				[parentType, parentId]
			);
			return rows;
		} catch (err) {
			console.error(
				'Error en WorkspaceAssignationRepository.findByParent:',
				err
			);
			throw err;
		}
	}

	async delete(id) {
		try {
			const { rows } = await this.connection.execute(
				`DELETE FROM workspace_assignation WHERE id = UNHEX(?)`,
				[id]
			);
			return rows.affectedRows > 0;
		} catch (err) {
			console.error('Error en WorkspaceAssignationRepository.delete:', err);
			throw err;
		}
	}

	async deleteByParent(parentType, parentId) {
		try {
			const { rows } = await this.connection.execute(
				`DELETE FROM workspace_assignation 
                 WHERE parent_type = ? AND parent_id = UNHEX(?)`,
				[parentType, parentId]
			);
			return rows.affectedRows;
		} catch (err) {
			console.error(
				'Error en WorkspaceAssignationRepository.deleteByParent:',
				err
			);
			throw err;
		}
	}

	async exists(userId, workspaceId, parentType, parentId) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT 1 FROM workspace_assignation 
                 WHERE user_id = UNHEX(?) AND workspace_id = UNHEX(?) 
                   AND parent_type = ? AND parent_id = UNHEX(?)`,
				[userId, workspaceId, parentType, parentId]
			);
			return rows.length > 0;
		} catch (err) {
			console.error('Error en WorkspaceAssignationRepository.exists:', err);
			throw err;
		}
	}
}

const WorkspaceAssignationRepository = new WorkspaceAssignationRepositoryClass(
	await connect()
);

export default WorkspaceAssignationRepository;
