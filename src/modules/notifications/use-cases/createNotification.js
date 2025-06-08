import {
	generateRandomCharacters,
	getDateNow,
} from '../../../shared/utils/utils.js';
import { Notification } from '../domain/entities/Notification.js';

export default function createNotification(notificationRepository) {
	return async function ({ recipientId, type, title, message, data }) {
		if (!title || !recipientId || !type) {
			throw new Error(
				`El titulo, el ID del usuario y el tipo de notificacion son obligatorios`
			);
		}
		console.log('recipientId en createNotificationUseCase: ', recipientId);
		const now = getDateNow();
		const id = generateRandomCharacters(12);
		try {
			const notification = new Notification(
				id,
				recipientId,
				type,
				title,
				message,
				data,
				false,
				now
			);
			await notificationRepository.createNotification(notification);

			return notification;
		} catch (error) {
			throw new Error(`Error en createNotification: ${error.message}`);
		}
	};
}
