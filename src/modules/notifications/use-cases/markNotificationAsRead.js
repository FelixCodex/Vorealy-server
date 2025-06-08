export default function markNotificationAsRead(notificationRepository) {
	return async function (notificationId) {
		try {
			await notificationRepository.markAsRead(notificationId);
			return { success: true };
		} catch (error) {
			throw new Error(`Error en markNotificationAsRead: ${error.message}`);
		}
	};
}
