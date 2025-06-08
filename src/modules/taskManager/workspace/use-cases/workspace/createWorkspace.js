import crypto from 'node:crypto';
import { Workspace } from '../../domain/entity/Workspace.js';
import { getDateNow } from '../../../../../shared/utils/utils.js';

export default function createWorkSpace(workspaceRepository) {
	return async function ({ userId, name, color, icon }) {
		try {
			if (!name || typeof name !== 'string' || name.trim() === '') {
				throw new Error('Workspace name invalid');
			}
			if (
				!color ||
				typeof color !== 'string' ||
				color.trim() === '' ||
				color.length < 7
			) {
				throw new Error('Workspace color invalid');
			}
			if (!icon || isNaN(icon)) {
				throw new Error('Workspace icon invalid');
			}
			if (!userId) {
				throw new Error('User ID invalid');
			}

			const now = getDateNow();

			const workspace = new Workspace(
				crypto.randomUUID(),
				userId,
				name.trim(),
				icon,
				color,
				now,
				now
			);
			const createdWorkspace = await workspaceRepository.create(workspace);
			return createdWorkspace;
		} catch (error) {
			throw new Error(`Error al crear workspace: ${error.message}`);
		}
	};
}
