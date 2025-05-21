import createWorkSpace from '../../use-cases/createWorkspace';
import deleteWorkSpace from '../../use-cases/deleteWorkspace';
import getUserWorkspaces from '../../use-cases/getUserWorkspaces';
import getWorkspaceById from '../../use-cases/getWorkspaceById';
import updateWorkSpace from '../../use-cases/updateWorkspace';

export function createWorkspaceController(workspaceRepo) {
	const createWSUseCase = createWorkSpace(workspaceRepo);
	const updateWSUseCase = updateWorkSpace(workspaceRepo);
	const deleteWSUseCase = deleteWorkSpace(workspaceRepo);
	const getWSByIdUseCase = getWorkspaceById(workspaceRepo);
	const getUserWSUseCase = getUserWorkspaces(workspaceRepo);

	return {
		async create(req, res) {
			const userId = req.user.id;

			try {
				const { name, color, icon } = req.body;

				const createdWorkspace = createWSUseCase(userId, name, color, icon);
				if (!createdWorkspace) {
					return res.status(500).json({ error: 'Error creating workspace' });
				}

				res.status(201).json(createdWorkspace);
			} catch (err) {
				res.status(400).json({ error: err.message });
			}
		},

		async getUserWorkspaces(req, res) {
			try {
				const { userId } = req.params;
				const workspaces = await getUserWSUseCase(userId);
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
		async update(req, res) {
			const userId = req.user.id;
			const { workspaceId } = req.params;
			const { name, color, icon_id } = req.body;

			try {
				const updatedWorkspace = await updateWSUseCase({
					id: workspaceId,
					userId,
					name,
					color,
					icon_id,
				});
				if (!updatedWorkspace) {
					return res.status(500).json({ error: 'Error updating workspace' });
				}

				res.json(updatedWorkspace);
			} catch (err) {
				console.error('Error en workspace.update:', err);
				res.status(500).json({ error: 'Internal Server Error' });
			}
		},
		async delete(req, res) {
			const userId = req.user.id;
			const { workspaceId } = req.params;

			const workspace = await getWSByIdUseCase(workspaceId);

			if (workspace.owner_id !== userId) {
				return res
					.status(403)
					.json({ error: 'Usuario no es el propietario del workspace' });
			}

			try {
				const result = await deleteWSUseCase(workspaceId, userId);
				if (!result.success) {
					return res.status(500).json({ error: 'Error deleting workspace' });
				}

				res.status(200).json({ message: 'Workspace eliminado correctamente' });
			} catch (err) {
				console.error('Error en workspace.delete:', err);
				res.status(500).json({ error: 'Internal Server Error' });
			}
		},
	};
}
