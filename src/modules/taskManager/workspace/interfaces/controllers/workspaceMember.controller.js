import getUserMemberships from '../../use-cases/workspaceMember/getUserMemberships.js';
import getWorkspaceMember from '../../use-cases/workspaceMember/getWorkspaceMember.js';
import getWorkspaceMembers from '../../use-cases/workspaceMember/getWorkspaceMembers.js';
import removeAllWorkspaceMembers from '../../use-cases/workspaceMember/removeAllWorkspaceMembers.js';
import removeWorkspaceMember from '../../use-cases/workspaceMember/removeWorkspaceMember.js';
import updateWorkspaceMemberRole from '../../use-cases/workspaceMember/updateWorkspaceMemberRole.js';

export default function createWorkspaceMemberController(workspaceMemberRepo) {
	const getWSMembersUseCase = getWorkspaceMembers(workspaceMemberRepo);
	const getWSMemberUseCase = getWorkspaceMember(workspaceMemberRepo);
	const getUserMembershipsUseCase = getUserMemberships(workspaceMemberRepo);
	const updateWSMemberRoleUseCase =
		updateWorkspaceMemberRole(workspaceMemberRepo);
	const removeWSMemberUseCase = removeWorkspaceMember(workspaceMemberRepo);
	const removeAllWSMembersUseCase =
		removeAllWorkspaceMembers(workspaceMemberRepo);

	return {
		async getMembers(req, res) {
			try {
				const { workspaceId } = req.params;
				const members = await getWSMembersUseCase(workspaceId);
				return res.status(200).json({
					success: true,
					data: members,
				});
			} catch (error) {
				console.error('Error en WorkspaceMemberController.getMembers:', error);
				return res.status(500).json({
					success: false,
					message:
						error.message || 'Error al obtener los miembros del workspace',
				});
			}
		},

		async getMember(req, res) {
			try {
				const { workspaceId, userId } = req.params;
				const member = await getWSMemberUseCase(workspaceId, userId);
				return res.status(200).json({
					success: true,
					data: member,
				});
			} catch (error) {
				console.error('Error en WorkspaceMemberController.getMember:', error);

				if (error.message === 'Usuario no es miembro del workspace') {
					return res.status(404).json({
						success: false,
						message: error.message,
					});
				}

				return res.status(500).json({
					success: false,
					message: error.message || 'Error al obtener el miembro del workspace',
				});
			}
		},

		async getUserMemberships(req, res) {
			try {
				const userId = req.user.id;
				const memberships = await getUserMembershipsUseCase(userId);
				return res.status(200).json({
					success: true,
					data: memberships,
				});
			} catch (error) {
				console.error(
					'Error en WorkspaceMemberController.getMemberships:',
					error
				);

				if (error.message === 'Usuario no es miembro del workspace') {
					return res.status(404).json({
						success: false,
						message: error.message,
					});
				}

				return res.status(500).json({
					success: false,
					message: error.message || 'Error al obtener el miembro del workspace',
				});
			}
		},

		async updateRole(req, res) {
			try {
				const { workspaceId, userId } = req.params;
				const { role } = req.body;

				const member = await updateWSMemberRoleUseCase(
					workspaceId,
					userId,
					role
				);

				return res.status(200).json({
					success: true,
					data: member,
				});
			} catch (error) {
				console.error('Error en WorkspaceMemberController.updateRole:', error);

				if (
					[
						'El usuario no es miembro de este workspace',
						'Rol no válido',
					].includes(error.message)
				) {
					return res.status(404).json({
						success: false,
						message: error.message,
					});
				}

				return res.status(500).json({
					success: false,
					message: 'Error al actualizar el rol del miembro',
				});
			}
		},

		async removeMember(req, res) {
			try {
				const { workspaceId, userId } = req.params;

				const result = await removeWSMemberUseCase(workspaceId, userId);

				return res.status(200).json({ success: result });
			} catch (error) {
				console.error(
					'Error en WorkspaceMemberController.removeMember:',
					error
				);

				if (error.message === 'El usuario no es miembro de este workspace') {
					return res.status(404).json({
						success: false,
						message: error.message,
					});
				}

				return res.status(500).json({
					success: false,
					message:
						error.message || 'Error al eliminar el miembro del workspace',
				});
			}
		},

		async removeAllMembers(req, res) {
			try {
				const { workspaceId } = req.params;

				const result = await removeAllWSMembersUseCase(workspaceId);

				return res.status(200).json(result);
			} catch (error) {
				console.error(
					'Error en WorkspaceMemberController.removeAllMembers:',
					error
				);
				return res.status(500).json({
					success: false,
					message:
						error.message ||
						'Error al eliminar todos los miembros del workspace',
				});
			}
		},
	};
}
