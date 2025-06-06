import crypto from 'node:crypto';

export default function createWorkSpace(workspaceRepository) {
	return async function ({ userId, name, color, icon }) {
		if (!name || typeof name !== 'string' || name.trim() === '') {
			return res.status(400).json({ error: 'Workspace name invalid' });
		}
		if (
			!color ||
			typeof color !== 'string' ||
			color.trim() === '' ||
			color.length < 7
		) {
			return res.status(400).json({ error: 'Workspace color invalid' });
		}
		if (!icon || isNaN(icon)) {
			return res.status(400).json({ error: 'Workspace icon invalid' });
		}
		if (!userId) {
			return res.status(400).json({ error: 'Workspace icon invalid' });
		}

		const now = new Date().toISOString();

		const workspace = new Workspace(
			crypto.randomUUID(),
			name.trim(),
			userId,
			icon,
			now
		);
		const createdWorkspace = await workspaceRepository.create(workspace);
		return createdWorkspace;
	};
}
