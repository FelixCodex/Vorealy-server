import addWorkspaceMember from '../../use-cases/addWorkspaceMember';
import getUserWorkspaces from '../../use-cases/getUserWorkspaces';
import getWorkspaceMember from '../../use-cases/getWorkspaceMember';
import getWorkspaceMembers from '../../use-cases/getWorkspaceMembers';
import removeAllWorkspaceMembers from '../../use-cases/removeAllWorkspaceMembers';
import removeWorkspaceMember from '../../use-cases/removeWorkspaceMember';
import updateWorkspaceMemberRole from '../../use-cases/updateWorkspaceMemberRole';

export default function createWorkspaceMemberController(
	workspaceMemberRepository
) {
	const getWorkspaceMembersUseCase = getWorkspaceMembers(
		workspaceMemberRepository
	);
	const getUserWorkspacesUseCase = getUserWorkspaces(workspaceMemberRepository);
	const getWorkspaceMemberUseCase = getWorkspaceMember(
		workspaceMemberRepository
	);
	const addWorkspaceMemberUseCase = addWorkspaceMember(
		workspaceMemberRepository
	);
	const updateWorkspaceMemberRoleUseCase = updateWorkspaceMemberRole(
		workspaceMemberRepository
	);
	const removeWorkspaceMemberUseCase = removeWorkspaceMember(
		workspaceMemberRepository
	);
	const removeAllWorkspaceMembersUseCase = removeAllWorkspaceMembers(
		workspaceMemberRepository
	);

	return {
		async getMembers(req, res) {
			try {
				const { workspaceId } = req.params;
				const members = await getWorkspaceMembersUseCase(workspaceId);
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

		async getUserWorkspaces(req, res) {
			try {
				const { userId } = req.params;
				const workspaces = await getUserWorkspacesUseCase(userId);
				return res.status(200).json(workspaces);
			} catch (error) {
				console.error(
					'Error en WorkspaceMemberController.getUserWorkspaces:',
					error
				);
				return res.status(500).json({
					success: false,
					message:
						error.message || 'Error al obtener los workspaces del usuario',
				});
			}
		},

		async getMember(req, res) {
			try {
				const { workspaceId, userId } = req.params;
				const member = await getWorkspaceMemberUseCase(workspaceId, userId);
				return res.status(200).json(member);
			} catch (error) {
				console.error('Error en WorkspaceMemberController.getMember:', error);

				// Si el usuario no es miembro, devuelve 404
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
				const invitedBy = req.user.id; // Asumiendo que tienes middleware de autenticación

				const member = await addWorkspaceMemberUseCase({
					workspaceId,
					userId,
					role,
					invitedBy,
				});

				return res.status(201).json(member);
			} catch (error) {
				console.error('Error en WorkspaceMemberController.addMember:', error);

				// Si el usuario ya es miembro, devuelve 409 Conflict
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

				const member = await updateWorkspaceMemberRoleUseCase(
					workspaceId,
					userId,
					role
				);

				return res.status(200).json(member);
			} catch (error) {
				console.error('Error en WorkspaceMemberController.updateRole:', error);

				// Si el usuario no es miembro, devuelve 404
				if (error.message === 'El usuario no es miembro de este workspace') {
					return res.status(404).json({
						success: false,
						message: error.message,
					});
				}

				// Si el rol no es válido, devuelve 400
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

				const result = await removeWorkspaceMemberUseCase(workspaceId, userId);

				return res.status(200).json(result);
			} catch (error) {
				console.error(
					'Error en WorkspaceMemberController.removeMember:',
					error
				);

				// Si el usuario no es miembro, devuelve 404
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

				const result = await removeAllWorkspaceMembersUseCase(workspaceId);

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
