import crypto from 'node:crypto';
export default function createFolder(folderRepository) {
	return async function (folderData) {
		try {
			if (!folderData.name || !folderData.projectId) {
				throw new Error(
					'El nombre de la carpeta y el ID del proyecto son obligatorios'
				);
			}

			if (!folderData.createdAt) {
				folderData.createdAt = new Date().toISOString();
			}
			if (!folderData.updatedAt) {
				folderData.updatedAt = folderData.createdAt;
			}

			const {
				project_id,
				workspace_id,
				name,
				description,
				color,
				icon,
				is_private,
				automation_rules,
				created_by,
				updated_by,
				metadata,
			} = folderData;

			const now = new Date().toISOString();
			const folder = new Folder(
				crypto.randomUUID(),
				project_id,
				workspace_id,
				name,
				description,
				color,
				icon,
				is_private,
				automation_rules,
				now,
				created_by,
				now,
				updated_by,
				metadata
			);

			return await folderRepository.create(folder);
		} catch (error) {
			throw new Error(`Error al crear carpeta: ${error.message}`);
		}
	};
}
