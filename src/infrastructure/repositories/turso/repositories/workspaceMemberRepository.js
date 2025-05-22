import { connect } from './connection';

class WorkspaceMemberRepositoryClass {
	constructor(connection) {
		this.connection = connection;
	}

	async getByWorkspaceId(workspaceId) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT 
          HEX(workspace_id) AS workspace_id, 
          HEX(user_id) AS user_id, 
          role, 
          joined_at, 
          HEX(invited_by) AS invited_by 
        FROM workspace_members 
        WHERE workspace_id = UNHEX(?);`,
				[workspaceId]
			);
			return rows;
		} catch (err) {
			console.error(
				'Error en WorkspaceMemberRepository.getByWorkspaceId:',
				err
			);
			throw err;
		}
	}

	async getByUserId(userId) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT 
          HEX(workspace_id) AS workspace_id, 
          HEX(user_id) AS user_id, 
          role, 
          joined_at, 
          HEX(invited_by) AS invited_by 
        FROM workspace_members 
        WHERE user_id = UNHEX(?);`,
				[userId]
			);
			return rows;
		} catch (err) {
			console.error('Error en WorkspaceMemberRepository.getByUserId:', err);
			throw err;
		}
	}

	async getMember(workspaceId, userId) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT 
          HEX(workspace_id) AS workspace_id, 
          HEX(user_id) AS user_id, 
          role, 
          joined_at, 
          HEX(invited_by) AS invited_by 
        FROM workspace_members 
        WHERE workspace_id = UNHEX(?) AND user_id = UNHEX(?);`,
				[workspaceId, userId]
			);
			return rows[0] || null;
		} catch (err) {
			console.error('Error en WorkspaceMemberRepository.getMember:', err);
			throw err;
		}
	}

	async addMember({
		workspaceId,
		userId,
		role = 'member',
		joinedAt,
		invitedBy,
	}) {
		try {
			const { rows } = await this.connection.execute(
				`INSERT INTO workspace_members(workspace_id, user_id, role, joined_at, invited_by) 
         VALUES(UNHEX(?), UNHEX(?), ?, ?, UNHEX(?))
         RETURNING HEX(workspace_id) AS workspace_id, HEX(user_id) AS user_id, role, joined_at, HEX(invited_by) AS invited_by;`,
				[workspaceId, userId, role, joinedAt, invitedBy]
			);
			return rows[0];
		} catch (err) {
			console.error('Error en WorkspaceMemberRepository.addMember:', err);
			throw err;
		}
	}

	async updateRole(workspaceId, userId, role) {
		try {
			const { rows } = await this.connection.execute(
				`UPDATE workspace_members 
         SET role = ? 
         WHERE workspace_id = UNHEX(?) AND user_id = UNHEX(?)
         RETURNING HEX(workspace_id) AS workspace_id, HEX(user_id) AS user_id, role, joined_at, HEX(invited_by) AS invited_by;`,
				[role, workspaceId, userId]
			);
			return rows[0] || null;
		} catch (err) {
			console.error('Error en WorkspaceMemberRepository.updateRole:', err);
			throw err;
		}
	}

	async removeMember(workspaceId, userId) {
		try {
			await this.connection.execute(
				`DELETE FROM workspace_members 
         WHERE workspace_id = UNHEX(?) AND user_id = UNHEX(?);`,
				[workspaceId, userId]
			);
			return { success: true, message: 'Miembro eliminado correctamente' };
		} catch (err) {
			console.error('Error en WorkspaceMemberRepository.removeMember:', err);
			throw err;
		}
	}

	async removeAllMembers(workspaceId) {
		try {
			await this.connection.execute(
				`DELETE FROM workspace_members 
         WHERE workspace_id = UNHEX(?);`,
				[workspaceId]
			);
			return {
				success: true,
				message: 'Todos los miembros eliminados correctamente',
			};
		} catch (err) {
			console.error(
				'Error en WorkspaceMemberRepository.removeAllMembers:',
				err
			);
			throw err;
		}
	}
}
const WorkspaceMemberRepository = new WorkspaceMemberRepositoryClass(connect());

export default WorkspaceMemberRepository;
