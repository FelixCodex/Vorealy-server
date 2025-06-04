export default function createSubTask(subtaskRepository) {
	return async function (subTaskData) {
		try {
			if (!subTaskData.name || !subTaskData.workspaceId) {
				throw new Error(
					'El nombre de la subtarea y el ID del workspace son obligatorios'
				);
			}
			if (!['low', 'normal', 'high', 'urgent'].includes(taskData.priority)) {
				throw new Error('La prioridad de la tarea no es valida');
			}

			const now = new Date().toISOString();

			const {
				title,
				task_id,
				workspace_id,
				completed,
				created_by,
				start_date,
				end_date,
				assigned_to,
				priority,
				estimated_time,
			} = subTaskData;

			const subtask = new SubTask(
				title,
				task_id,
				workspace_id,
				completed,
				created_by,
				now,
				now,
				start_date,
				end_date,
				assigned_to,
				priority,
				estimated_time
			);

			return await subtaskRepository.create(subtask);
		} catch (error) {
			throw new Error(`Error al crear tarea: ${error.message}`);
		}
	};
}
