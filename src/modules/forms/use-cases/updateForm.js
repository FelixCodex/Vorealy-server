import crypto from 'node:crypto';
export default function updateForm(formRepository) {
	return async function (formId, formData) {
		if (!formId || !formData) {
			throw new Error(
				'El ID del formulario y el ID del usuario son obligatorios'
			);
		}

		try {
			const form = await formRepository.getById(formId);
			if (!form) {
				throw new Error('Formulario no encontrado');
			}
			const updatedForm = await formRepository.update(formId, formData);
			return updatedForm;
		} catch (error) {
			throw new Error(`Error al actualizar el formulario: ${error.message}`);
		}
	};
}
