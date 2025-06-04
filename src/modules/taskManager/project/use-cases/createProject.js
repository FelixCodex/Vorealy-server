import crypto from 'node:crypto';
export default function createProject(projectRepository) {
	return async function (projectData) {
		try {
			if (!projectData.name || !projectData.workspaceId) {
				throw new Error(
					'El nombre del proyecto y el ID del workspace son obligatorios'
				);
			}

			if (!projectData.createdAt) {
				projectData.createdAt = new Date().toISOString();
			}
			if (!projectData.updatedAt) {
				projectData.updatedAt = projectData.createdAt;
			}

			const now = new Date().toISOString();
			const {
				workspace_id,
				name,
				description,
				color,
				icon,
				visibility = 'public',
				features_enabled,
				automation_rules,
				created_by,
				updated_by,
				completed_at,
				estimated_hours,
				working_days,
				working_hours,
				holidays,
				tags,
				metadata,
			} = projectData;

			const project = new Project(
				crypto.randomUUID(),
				workspace_id,
				name,
				description,
				color,
				icon,
				visibility,
				features_enabled,
				automation_rules,
				now,
				created_by,
				now,
				updated_by,
				completed_at,
				estimated_hours,
				working_days,
				working_hours,
				holidays,
				tags,
				metadata
			);

			return await projectRepository.create(project);
		} catch (error) {
			throw new Error(`Error al crear proyecto: ${error.message}`);
		}
	};
}
