import crypto from 'node:crypto';
export default function submitForm(formRepository, formSubmissionRepository) {
	return async function ({ formId, data, submittedBy }) {
		if (!formId || !submittedBy) {
			throw new Error(
				'El ID del formulario y el ID del usuario son obligatorios'
			);
		}

		try {
			const form = await formRepository.getById(formId);
			if (!form) {
				throw new Error('Formulario no encontrado');
			}

			const validation = form.validateSubmission(data);
			if (!validation.isValid) {
				throw new Error(
					`Datos inválidos: ${JSON.stringify(validation.errors)}`
				);
			}

			const submission = new FormSubmission({
				id: crypto.randomUUID(),
				formId,
				data,
				submittedBy,
			});

			return await formSubmissionRepository.create(submission);
		} catch (error) {
			throw new Error(
				`Error al enviar la respuesta de formulario: ${error.message}`
			);
		}
	};
}
