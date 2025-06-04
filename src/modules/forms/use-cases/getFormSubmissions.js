export default function getFormSubmissions(formSubmissionRepository) {
	return async function (formId) {
		try {
			if (!formId) {
				throw new Error(`El ID del formulario es obligatorio`);
			}
			return await formSubmissionRepository.getByFormId(formId);
		} catch (error) {
			throw new Error(
				`Error al obtener las respuestas de formulario: ${error.message}`
			);
		}
	};
}
