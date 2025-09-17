export default function getTasksByFolderId(taskRepository, folderRepository) {
	return async function (folderId) {
		try {
			if (!folderId) {
				throw new Error('El ID de la carpeta es obligatorio');
			}

			// Verificar que la carpeta existe
			const folder = await folderRepository.getById(folderId);
			if (!folder) {
				throw new Error(`Carpeta con ID ${folderId} no encontrada`);
			}

			const tasks = await taskRepository.getByFolderId(folderId);
			return tasks;
		} catch (error) {
			throw new Error(`Error al obtener tasks por carpeta: ${error.message}`);
		}
	};
}
