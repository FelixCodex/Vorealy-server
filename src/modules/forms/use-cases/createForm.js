import crypto from 'node:crypto';
export default function createForm(formRepository) {
	return async function ({
		name,
		description,
		elements,
		createdBy,
		projectId,
		workspaceId,
	}) {
		if (!name || !projectId || !workspaceId) {
			throw new Error(
				'El nombre ,ID del projecto y el ID del workspace son obligatorios'
			);
		}

		try {
			const form = new Form({
				id: crypto.randomUUID(),
				name,
				description,
				elements,
				createdBy,
				projectId,
				workspaceId,
			});

			return await formRepository.create(form);
		} catch (error) {
			throw new Error(`Error al crear el formulario: ${error.message}`);
		}
	};
}
