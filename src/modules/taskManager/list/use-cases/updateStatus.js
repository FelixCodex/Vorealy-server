import { getDateNow } from '../../../../shared/utils/utils.js';

export default function updateStatus(listRepository) {
	return async function (id, updatedBy, statusData) {
		try {
			const existingStatus = await listRepository.getStatusById(id);
			if (!existingStatus) {
				throw new Error(`Lista con ID ${id} no encontrada`);
			}

			const now = getDateNow();
			const updatedStatus = await listRepository.updateStatus({
				id,
				...statusData,
				updatedAt: now,
				updatedBy,
			});

			return updatedStatus;
		} catch (error) {
			throw new Error(`Error al actualizar lista: ${error.message}`);
		}
	};
}
