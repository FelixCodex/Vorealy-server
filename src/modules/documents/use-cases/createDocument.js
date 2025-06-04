import crypto from 'node:crypto';
export default function createDocument(documentRepository) {
	return async function ({
		title,
		content = '',
		parentType,
		parentId,
		createdBy,
	}) {
		try {
			if (!parentId || !parentType) {
				throw new Error('El ID del padre y el tipo de padre son obligatorios');
			}
			if (['project', 'folder', 'list'].includes(parentType)) {
				throw new Error('El tipo del padre no es valido');
			}

			const now = new Date().toISOString();

			const document = new Document(
				crypto.randomUUID(),
				title,
				content,
				parentType,
				parentId,
				createdBy,
				now,
				now
			);

			return await documentRepository.create(document);
		} catch (error) {
			throw new Error(`Error al obtener todas las carpetas: ${error.message}`);
		}
	};
}
