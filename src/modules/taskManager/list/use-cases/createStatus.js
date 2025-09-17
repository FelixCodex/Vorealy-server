import crypto from 'node:crypto';
import { getDateNow } from '../../../../shared/utils/utils.js';
import { Status } from '../domain/entity/Status.js';
export default function createStatus(listRepository) {
	return async function ({ listId, name, color = '#808080', createdBy }) {
		try {
			if (!name || !listId) {
				throw new Error(
					'El nombre de la lista, el ID del padre son obligatorios'
				);
			}

			const list = await listRepository.getById(listId);
			if (!list) {
				throw new Error('Carpeta padre no encontrado');
			}

			const now = getDateNow();

			const status = new Status(
				crypto.randomUUID(),
				listId,
				name,
				color,
				createdBy,
				now,
				createdBy,
				now
			);

			return await listRepository.createStatus(status);
		} catch (error) {
			console.log(error);
			throw new Error(`Error al crear lista: ${error.message}`);
		}
	};
}
