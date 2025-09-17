export default function getTasksByProjectId(taskRepository, projectRepository) {
	return async function (projectId) {
		try {
			if (!projectId) {
				throw new Error('El ID del proyecto es obligatorio');
			}

			// Verificar que el proyecto existe
			const project = await projectRepository.getById(projectId);
			if (!project) {
				throw new Error(`Proyecto con ID ${projectId} no encontrado`);
			}

			const tasks = await taskRepository.getByProjectId(projectId);
			return tasks;
		} catch (error) {
			throw new Error(`Error al obtener tasks por proyecto: ${error.message}`);
		}
	};
}
