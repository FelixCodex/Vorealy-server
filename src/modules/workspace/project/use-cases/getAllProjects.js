export default function getAllProjects(projectRepository) {
	return async function () {
		try {
			return await projectRepository.getAll();
		} catch (error) {
			throw new Error(`Error al obtener todos los proyectos: ${error.message}`);
		}
	};
}
