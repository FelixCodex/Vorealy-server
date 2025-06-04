export default function getFormByProjectId(formRepository) {
	return async function (projectId) {
		try {
			if (!projectId) {
				throw new Error(`El ID del projecto es obligatorio`);
			}
			return await formRepository.getByProjectId(projectId);
		} catch (error) {
			throw new Error(
				`Error al obtener los formularios del projecto: ${error.message}`
			);
		}
	};
}
