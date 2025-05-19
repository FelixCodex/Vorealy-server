export default function deleteProject(projectRepository) {
	return async function (id) {
		try {
			const existingProject = await projectRepository.getById(id);
			if (!existingProject) {
				throw new Error(`Proyecto con ID ${id} no encontrado`);
			}

			return await projectRepository.delete(id);
		} catch (error) {
			throw new Error(`Error al eliminar proyecto: ${error.message}`);
		}
	};
}
