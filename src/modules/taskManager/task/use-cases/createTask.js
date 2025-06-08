import crypto from 'node:crypto';
import { getDateNow } from '../../../../shared/utils/utils.js';
import { List } from '../domain/entity/Task.js';
export default function createTask(taskRepository) {
	return async function (taskData) {
		try {
			if (!taskData.name || !taskData.workspaceId) {
				throw new Error(
					'El nombre de la tarea y el ID del workspace son obligatorios'
				);
			}
			if (!['low', 'normal', 'high', 'urgent'].includes(taskData.priority)) {
				throw new Error('La prioridad de la tarea no es valida');
			}

			const now = getDateNow();

			const list = new List(
				crypto.randomUUID(),
				taskData.title,
				taskData.list_id,
				taskData.workspace_id,
				taskData.created_by,
				now,
				now,
				taskData.start_date,
				taskData.end_date,
				taskData.assigned_to,
				taskData.state,
				taskData.priority,
				taskData.estimated_time
			);

			return await taskRepository.create(list);
		} catch (error) {
			throw new Error(`Error al crear tarea: ${error.message}`);
		}
	};
}
