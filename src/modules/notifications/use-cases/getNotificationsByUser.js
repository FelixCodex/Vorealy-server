export default function getNotificationsByUser(notificationRepository) {
	return async function ({ userId, unreadOnly = false }) {
		try {
			const notifications = await notificationRepository.getNotificationsByUser(
				userId,
				unreadOnly
			);
			return notifications;
		} catch (error) {
			throw new Error(`Error en getNotificationsByUser: ${error.message}`);
		}
	};
}
