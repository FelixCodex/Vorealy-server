import crypto from 'node:crypto';
import { Project } from '../domain/entity/Project.js';
import { getDateNow } from '../../../../shared/utils/utils.js';
export default function createProject(projectRepository) {
	return async function ({
		workspaceId,
		name,
		description,
		color,
		icon,
		visibility = 'public',
		featuresEnabled,
		automationRules,
		createdBy,
		updatedBy,
		completedAt,
		estimatedHours,
		workingDays,
		workingHours,
		holidays,
		tags,
		metadata,
	}) {
		try {
			if (!name || !workspaceId) {
				throw new Error(
					'El nombre del proyecto y el ID del workspace son obligatorios'
				);
			}

			const now = getDateNow();

			const project = new Project(
				crypto.randomUUID(),
				workspaceId,
				name,
				description,
				color,
				icon,
				visibility,
				featuresEnabled,
				automationRules,
				now,
				createdBy,
				now,
				updatedBy,
				completedAt,
				estimatedHours,
				workingDays,
				workingHours,
				holidays,
				tags,
				metadata
			);

			return await projectRepository.create(project);
		} catch (error) {
			console.log(error);
			throw new Error(`Error al crear proyecto: ${error.message}`);
		}
	};
}
