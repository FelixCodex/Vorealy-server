import createWorkSpace from '../../use-cases/workspace/createWorkspace.js';
import deleteWorkSpace from '../../use-cases/workspace/deleteWorkspace.js';
import getUserWorkspaces from '../../use-cases/workspace/getUserWorkspaces.js';
import updateWorkSpace from '../../use-cases/workspace/updateWorkspace.js';

export default function createWorkspaceController(workspaceRepo) {
	const createWSUseCase = createWorkSpace(workspaceRepo);
	const updateWSUseCase = updateWorkSpace(workspaceRepo);
	const deleteWSUseCase = deleteWorkSpace(workspaceRepo);
	const getUserWSUseCase = getUserWorkspaces(workspaceRepo);

	return {
		async create(req, res) {
			const userId = req.user.id;

			try {
				const { name, color, icon } = req.body;

				const createdWorkspace = await createWSUseCase({
					userId,
					name,
					color,
					icon,
				});
				console.log(createdWorkspace);
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
				const userId = req.user.id;
				const workspaces = await getUserWSUseCase(userId);
				return res.status(200).json({ success: true, data: workspaces });
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
			const { workspaceId } = req.params;
			const { name, color, icon_id } = req.body;

			try {
				const updatedWorkspace = await updateWSUseCase({
					id: workspaceId,
					name,
					color,
					icon_id,
				});
				if (!updatedWorkspace) {
					return res.status(500).json({ error: 'Error updating workspace' });
				}

				res.json({ success: true, data: updatedWorkspace });
			} catch (err) {
				console.error('Error en workspace.update:', err);
				res
					.status(500)
					.json({ success: false, error: 'Internal Server Error' });
			}
		},
		async delete(req, res) {
			const { workspaceId } = req.params;

			try {
				const result = await deleteWSUseCase(workspaceId);
				if (!result) {
					return res
						.status(500)
						.json({ success: false, error: 'Error deleting workspace' });
				}

				res.status(200).json({
					success: true,
					message: 'Workspace eliminado correctamente',
				});
			} catch (err) {
				console.error('Error en workspace.delete:', err);
				res
					.status(500)
					.json({ success: false, error: 'Internal Server Error' });
			}
		},
	};
}
