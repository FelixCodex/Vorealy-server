import crypto from 'node:crypto';
import { getDateNow } from '../../../../shared/utils/utils.js';
import { Task } from '../domain/entity/Task.js';
export default function createTask(taskRepository, listRepository) {
	return async function ({
		title,
		listId,
		workspaceId,
		createdBy,
		startDate,
		endDate,
		state,
		priority,
		estimatedTime,
	}) {
		try {
			if (!title || !workspaceId) {
				throw new Error(
					'El nombre de la tarea y el ID del workspace son obligatorios'
				);
			}
			if (!priority) priority = null;
			if (!['low', 'normal', 'high', 'urgent', null].includes(priority)) {
				throw new Error('La prioridad de la tarea no es valida');
			}

			const list = await listRepository.getById(listId);
			if (!list) {
				throw new Error('Lista no encontrada');
			}

			const now = getDateNow();

			const task = new Task(
				crypto.randomUUID(),
				title,
				listId,
				workspaceId,
				createdBy,
				now,
				now,
				startDate,
				endDate,
				state,
				priority,
				estimatedTime
			);

			return await taskRepository.create(task);
		} catch (error) {
			throw new Error(`Error al crear tarea: ${error.message}`);
		}
	};
}
