import addWorkspaceMember from '../../use-cases/addWorkspaceMember';
import getUserWorkspaces from '../../use-cases/getUserWorkspaces';
import getWorkspaceMember from '../../use-cases/getWorkspaceMember';
import getWorkspaceMembers from '../../use-cases/getWorkspaceMembers';
import removeAllWorkspaceMembers from '../../use-cases/removeAllWorkspaceMembers';
import removeWorkspaceMember from '../../use-cases/removeWorkspaceMember';
import updateWorkspaceMemberRole from '../../use-cases/updateWorkspaceMemberRole';

export default function createWorkspaceMemberController(workspaceMemberRepo) {
	const getWSMembersUseCase = getWorkspaceMembers(workspaceMemberRepo);
	const getWSMemberUseCase = getWorkspaceMember(workspaceMemberRepo);
	const addWSMemberUseCase = addWorkspaceMember(workspaceMemberRepo);
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
				return res.status(200).json(members);
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
				return res.status(200).json(member);
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

		async addMember(req, res) {
			try {
				const { workspaceId } = req.params;
				const { userId, role } = req.body;
				const invitedBy = req.user.id;

				const member = await addWSMemberUseCase({
					workspaceId,
					userId,
					role,
					invitedBy,
				});

				return res.status(201).json(member);
			} catch (error) {
				console.error('Error en WorkspaceMemberController.addMember:', error);

				if (error.message === 'El usuario ya es miembro de este workspace') {
					return res.status(409).json({
						success: false,
						message: error.message,
					});
				}

				return res.status(500).json({
					success: false,
					message: error.message || 'Error al añadir miembro al workspace',
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

				return res.status(200).json(member);
			} catch (error) {
				console.error('Error en WorkspaceMemberController.updateRole:', error);

				if (error.message === 'El usuario no es miembro de este workspace') {
					return res.status(404).json({
						success: false,
						message: error.message,
					});
				}

				if (error.message === 'Rol no válido') {
					return res.status(400).json({
						success: false,
						message: error.message,
					});
				}

				return res.status(500).json({
					success: false,
					message: error.message || 'Error al actualizar el rol del miembro',
				});
			}
		},

		async removeMember(req, res) {
			try {
				const { workspaceId, userId } = req.params;

				const result = await removeWSMemberUseCase(workspaceId, userId);

				return res.status(200).json(result);
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
