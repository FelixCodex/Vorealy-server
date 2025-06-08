import getNotificationsByUser from '../../use-cases/getNotificationsByUser.js';
import markNotificationAsRead from '../../use-cases/markNotificationAsRead.js';

export default function createNotificationController(notificationRepo) {
	const getNotificationsByUserUC = getNotificationsByUser(notificationRepo);
	const markNotificationAsReadUC = markNotificationAsRead(notificationRepo);

	return {
		async getByUser(req, res) {
			try {
				const userId = req.user.id;
				const notifications = await getNotificationsByUserUC({ userId });
				res.status(200).json({ success: true, data: notifications });
			} catch (error) {
				res.status(400).json({ success: false, message: error.message });
			}
		},

		async markAsRead(req, res) {
			try {
				const { notificationId } = req.params;
				await markNotificationAsReadUC(notificationId);
				res
					.status(200)
					.json({ success: true, message: 'Notificación marcada como leída' });
			} catch (error) {
				res.status(400).json({ success: false, message: error.message });
			}
		},
	};
}
