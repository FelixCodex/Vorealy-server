export default function getProjectById(projectRepository) {
	return async function (id) {
		try {
			const project = await projectRepository.getById(id);
			if (!project) {
				throw new Error(`Proyecto con ID ${id} no encontrado`);
			}
			return project;
		} catch (error) {
			throw new Error(`Error al obtener proyecto por ID: ${error.message}`);
		}
	};
}
