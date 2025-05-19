import createWorkSpace from '../../use-cases/createWorkspace';
import deleteWorkSpace from '../../use-cases/deleteWorkspace';
import updateWorkSpace from '../../use-cases/updateWorkspace';

export function AuthController(workspaceRepo) {
	const createWSUseCase = createWorkSpace(workspaceRepo);
	const updateWSUseCase = updateWorkSpace(workspaceRepo);
	const deleteWSUseCase = deleteWorkSpace(workspaceRepo);
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
		async update(req, res) {
			const userId = req.user.id;
			const { id, name, color, icon } = req.body;

			try {
				const updatedWorkspace = await updateWSUseCase({
					id,
					userId,
					name,
					color,
					icon,
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
			const { id } = req.params;

			try {
				const result = await deleteWSUseCase(id, userId);
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
