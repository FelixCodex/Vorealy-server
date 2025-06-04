import crypto from 'node:crypto';
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

			const now = new Date().toISOString();
			const {
				title,
				list_id,
				workspace_id,
				created_by,
				start_date,
				end_date,
				assigned_to,
				state,
				priority,
				estimated_time,
			} = taskData;

			const list = new List(
				crypto.randomUUID(),
				title,
				list_id,
				workspace_id,
				created_by,
				now,
				now,
				start_date,
				end_date,
				assigned_to,
				state,
				priority,
				estimated_time
			);

			return await taskRepository.create(list);
		} catch (error) {
			throw new Error(`Error al crear tarea: ${error.message}`);
		}
	};
}
