import { connect } from './connection.js';

class WorkspaceInvitationRepositoryClass {
	constructor(connection) {
		this.connection = connection;
	}

	async createInvitation({
		id,
		workspaceId,
		invitedUserId,
		invitedByUserId,
		role = 'member',
		message = null,
		createdAt,
		expiresAt,
	}) {
		console.log({
			id,
			workspaceId,
			invitedUserId,
			invitedByUserId,
			role,
			message,
			createdAt,
			expiresAt,
		});
		try {
			await this.connection.execute(
				`INSERT INTO workspace_invitations (
        	id, workspace_id, invited_user_id, invited_by_user_id, role, message,created_at,expires_at
      		) VALUES (?, UNHEX(?), UNHEX(?), UNHEX(?), ?, ?,?,?)`,
				[
					id,
					workspaceId,
					invitedUserId,
					invitedByUserId,
					role,
					message,
					createdAt,
					expiresAt,
				]
			);

			return id;
		} catch (err) {
			console.error(
				'Error en WorkspaceInvitationRepository.createInvitation:',
				err
			);
			throw err;
		}
	}

	async getInvitationsByUser(userId, status = 'pending') {
		try {
			const { rows } = await this.connection.execute(
				`SELECT * FROM workspace_invitations
			WHERE invited_user_id = ?
			AND status = ?
			ORDER BY created_at DESC`,
				[userId, status]
			);
			return rows;
		} catch (err) {
			console.error(
				'Error en WorkspaceInvitationRepository.getInvitationsByUser:',
				err
			);
			throw err;
		}
	}

	async getById(id) {
		try {
			const { rows } = await this.connection.execute(
				`SELECT HEX(workspace_id) AS workspace_id, HEX(invited_user_id) AS invited_user_id, HEX(invited_by_user_id) AS invited_by_user_id,  *
			FROM workspace_invitations
			WHERE id = ?`,
				[id]
			);
			return rows[0] || null;
		} catch (err) {
			console.error(
				'Error en WorkspaceInvitationRepository.getInvitationById:',
				err
			);
			throw err;
		}
	}

	async acceptInvitation(id, now) {
		try {
			await this.connection.execute(
				`UPDATE workspace_invitations
				SET status = "accepted", responded_at = ?
				WHERE id = ?`,
				[now, id]
			);
			return true;
		} catch (err) {
			console.error(
				'Error en WorkspaceInvitationRepository.acceptInvitation:',
				err
			);
			throw err;
		}
	}

	async deleteInvitation(id) {
		try {
			await this.connection.execute(
				`DELETE FROM workspace_invitations
      			WHERE id = ?`,
				[id]
			);
			return true;
		} catch (err) {
			console.error(
				'Error en WorkspaceInvitationRepository.deleteInvitation:',
				err
			);
			throw err;
		}
	}
}

const WorkspaceInvitationRepository = new WorkspaceInvitationRepositoryClass(
	await connect()
);

export default WorkspaceInvitationRepository;
