import crypto from 'node:crypto';
import { List } from '../domain/entity/List.js';
import { getDateNow } from '../../../../shared/utils/utils.js';
export default function createList(
	listRepository,
	projectRepository,
	folderRepository
) {
	return async function ({
		name,
		color,
		description,
		parentId,
		parentType,
		workspaceId,
		createdBy,
		automationRules,
		assignedTo,
		defaultStates,
		statuses,
		priority,
		isPrivate,
		estimatedTime,
	}) {
		try {
			if (!name || !parentId || !parentType) {
				throw new Error(
					'El nombre de la lista, el ID del padre y el tipo de padre son obligatorios'
				);
			}

			if (!['project', 'folder'].includes(parentType)) {
				throw new Error('El tipo de padre debe ser project o folder');
			}

			let parent;

			if (parentType == 'project') {
				parent = await projectRepository.getById(parentId);
				if (!parent) {
					throw new Error('Proyecto padre no encontrado');
				}
			} else if (parentType == 'folder') {
				parent = await folderRepository.getById(parentId);
				if (!parent) {
					throw new Error('Carpeta padre no encontrado');
				}
			}

			const now = getDateNow();

			const list = new List(
				crypto.randomUUID(),
				name,
				color,
				description,
				parentId,
				parentType,
				workspaceId,
				createdBy,
				now,
				now,
				automationRules,
				assignedTo,
				defaultStates,
				statuses,
				priority,
				isPrivate,
				estimatedTime
			);

			return await listRepository.create(list);
		} catch (error) {
			console.log(error);
			throw new Error(`Error al crear lista: ${error.message}`);
		}
	};
}
